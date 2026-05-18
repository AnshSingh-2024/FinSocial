const prisma = require('../utils/prisma');
const logger = require('../utils/logger');
const { notificationQueue } = require('../jobs/index');
const { sanitizeFeedEvent } = require('../utils/feedAnonymize');

exports.executeTrade = async (req, res) => {
  try {
    const { stockId, side, quantity, reason, parentTradeId } = req.body;
    const userId = req.user.userId;

    if (!['BUY', 'SELL'].includes(side)) {
      return res.status(400).json({ error: 'side must be BUY or SELL' });
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'quantity must be a positive integer' });
    }

    const stock = await prisma.stock.findUnique({ where: { id: stockId } });
    if (!stock) return res.status(404).json({ error: 'Stock not found' });

    const totalValue = stock.price * quantity;

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });

      let holding = await tx.portfolioHolding.findUnique({
        where: { userId_stockId: { userId, stockId } }
      });

      if (side === 'BUY') {
        if (user.virtualBalance < totalValue) {
          throw new Error('Insufficient balance');
        }

        await tx.user.update({
          where: { id: userId },
          data: { virtualBalance: user.virtualBalance - totalValue }
        });

        if (holding) {
          const newTotalQty = holding.totalQuantity + quantity;
          const newAvgCost = ((holding.totalQuantity * holding.averageCost) + totalValue) / newTotalQty;
          holding = await tx.portfolioHolding.update({
            where: { id: holding.id },
            data: { totalQuantity: newTotalQty, averageCost: newAvgCost }
          });
        } else {
          holding = await tx.portfolioHolding.create({
            data: { userId, stockId, totalQuantity: quantity, averageCost: stock.price }
          });
        }
      } else if (side === 'SELL') {
        if (!holding || holding.totalQuantity < quantity) {
          throw new Error('Insufficient holding quantity');
        }

        await tx.user.update({
          where: { id: userId },
          data: { virtualBalance: user.virtualBalance + totalValue }
        });

        const newTotalQty = holding.totalQuantity - quantity;
        if (newTotalQty === 0) {
          await tx.portfolioHolding.delete({ where: { id: holding.id } });
          holding = null;
        } else {
          holding = await tx.portfolioHolding.update({
            where: { id: holding.id },
            data: { totalQuantity: newTotalQty }
          });
        }
      }

      const trade = await tx.trade.create({
        data: {
          userId,
          stockId,
          side,
          quantity,
          executionPrice: stock.price,
          totalValue,
          reason: reason || null,
          parentTradeId: parentTradeId || null,
        }
      });

      return { trade, holding, newBalance: side === 'BUY' ? user.virtualBalance - totalValue : user.virtualBalance + totalValue };
    });

    // Create anonymized feed event
    const feedEvent = await prisma.feedEvent.create({
      data: {
        userId,
        type: 'trade',
        refId: result.trade.id,
        payload: {
          side,
          quantity,
          ticker: stock.displayTicker,
          stockName: stock.name,
          price: stock.price,
          reason: reason || null,
        },
        isPublic: true,
      }
    });

    if (global.io) {
      global.io.emit('feed:new', sanitizeFeedEvent(feedEvent, null));
    }

    // Create a notification for the user confirming the trade
    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          type: 'trade_alert',
          title: `${side} ${quantity} ${stock.displayTicker}`,
          body: `Your ${side.toLowerCase()} order for ${quantity} shares of ${stock.displayTicker} at ₹${stock.price.toFixed(2)} was executed.`,
        },
      });
      notificationQueue.add({ notificationId: notification.id });
    } catch (notifErr) {
      logger.warn('Failed to create trade notification', { error: notifErr.message });
    }

    logger.info('Trade executed', { userId, stockId, side, quantity });
    res.json(result);
  } catch (error) {
    logger.error('executeTrade error', { error: error.message });
    res.status(400).json({ error: error.message });
  }
};

exports.getTradeHistory = async (req, res) => {
  try {
    const trades = await prisma.trade.findMany({
      where: { userId: req.user.userId },
      include: { stock: { select: { ticker: true, displayTicker: true, name: true, price: true } } },
      orderBy: { timestamp: 'desc' }
    });
    res.json(trades);
  } catch (error) {
    logger.error('getTradeHistory error', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
};

exports.copyTrade = async (req, res) => {
  try {
    const { tradeId } = req.params;
    const userId = req.user.userId;

    const sourceTrade = await prisma.trade.findUnique({
      where: { id: tradeId },
      include: { stock: true }
    });

    if (!sourceTrade) return res.status(404).json({ error: 'Trade not found' });

    // Execute the same trade as the current user
    req.body = {
      stockId: sourceTrade.stockId,
      side: sourceTrade.side,
      quantity: sourceTrade.quantity,
      reason: `Copied from trade by community member`,
      parentTradeId: tradeId,
    };

    return exports.executeTrade(req, res);
  } catch (error) {
    logger.error('copyTrade error', { error: error.message });
    res.status(500).json({ error: 'Failed to copy trade' });
  }
};

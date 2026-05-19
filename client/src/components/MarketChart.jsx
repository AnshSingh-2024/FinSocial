import { useEffect, useRef } from 'react';
import {
  createChart,
  ColorType,
  CandlestickSeries,
  BarSeries,
  LineSeries,
  AreaSeries,
  HistogramSeries,
  createSeriesMarkers,
} from 'lightweight-charts';
import {
  toLwcCandles,
  toLwcVolume,
  createIstTimeFormatter,
  createIstTickMarkFormatter,
} from '../utils/lwcData';

const istTimeFormatter = createIstTimeFormatter();
const istTickMarkFormatter = createIstTickMarkFormatter();

const UP = '#16a34a';
const DOWN = '#dc2626';

function linePoints(candles) {
  return candles.map((c) => ({ time: c.time, value: c.close }));
}

export default function MarketChart({
  data = [],
  height = 300,
  chartType = 'candle',
  showVolume = true,
  interval = '1d',
  chartKey = '',
  markIndex = -1,
  markLabel = 'Trade',
  compact = false,
}) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const mainRef = useRef(null);
  const volRef = useRef(null);
  const markersRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const chart = createChart(el, {
      width: el.clientWidth || 400,
      height,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#6b7280',
        fontSize: compact ? 10 : 11,
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: 'rgba(0,0,0,0.04)' },
        horzLines: { color: 'rgba(0,0,0,0.06)' },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: interval === 'intraday',
        secondsVisible: false,
        tickMarkMaxCharacterLength: interval === 'intraday' ? 5 : undefined,
        tickMarkFormatter: interval === 'intraday' ? istTickMarkFormatter : undefined,
      },
      localization: interval === 'intraday' ? {
        timeFormatter: istTimeFormatter,
      } : {},
      crosshair: { mode: 1 },
    });

    chartRef.current = chart;
    mainRef.current = null;
    volRef.current = null;
    markersRef.current = null;

    const ro = new ResizeObserver(() => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
      }
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
      mainRef.current = null;
      volRef.current = null;
      markersRef.current = null;
    };
  }, [height, compact, interval]);

  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.applyOptions({
      timeScale: {
        timeVisible: interval === 'intraday',
        secondsVisible: false,
        tickMarkMaxCharacterLength: interval === 'intraday' ? 5 : undefined,
        tickMarkFormatter: interval === 'intraday' ? istTickMarkFormatter : undefined,
      },
      localization: interval === 'intraday' ? {
        timeFormatter: istTimeFormatter,
      } : {},
    });
  }, [interval]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    if (mainRef.current) {
      try {
        chart.removeSeries(mainRef.current);
      } catch {
        /* already removed */
      }
      mainRef.current = null;
    }
    if (volRef.current) {
      try {
        chart.removeSeries(volRef.current);
      } catch {
        /* already removed */
      }
      volRef.current = null;
    }
    if (markersRef.current) {
      markersRef.current.setMarkers([]);
      markersRef.current = null;
    }

    const candles = toLwcCandles(data, interval);
    if (!candles.length) return;

    const bottomMargin = showVolume ? 0.28 : 0.08;
    chart.priceScale('right').applyOptions({
      scaleMargins: { top: 0.06, bottom: bottomMargin },
    });

    let main;
    const line = linePoints(candles);

    if (chartType === 'bar') {
      main = chart.addSeries(BarSeries, {
        upColor: UP,
        downColor: DOWN,
      });
      main.setData(candles);
    } else if (chartType === 'line') {
      main = chart.addSeries(LineSeries, {
        color: '#2563eb',
        lineWidth: 2,
      });
      main.setData(line);
    } else if (chartType === 'area') {
      main = chart.addSeries(AreaSeries, {
        lineColor: '#2563eb',
        topColor: 'rgba(37,99,235,0.35)',
        bottomColor: 'rgba(37,99,235,0.02)',
        lineWidth: 2,
      });
      main.setData(line);
    } else {
      main = chart.addSeries(CandlestickSeries, {
        upColor: UP,
        downColor: DOWN,
        borderUpColor: UP,
        borderDownColor: DOWN,
        wickUpColor: UP,
        wickDownColor: DOWN,
      });
      main.setData(candles);
    }

    mainRef.current = main;

    if (showVolume) {
      const vol = chart.addSeries(HistogramSeries, {
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume',
      });
      chart.priceScale('volume').applyOptions({
        scaleMargins: { top: 0.82, bottom: 0 },
      });
      vol.setData(toLwcVolume(data, interval));
      volRef.current = vol;
    }

    if (markIndex >= 0 && markIndex < candles.length) {
      const m = createSeriesMarkers(main, [
        {
          time: candles[markIndex].time,
          position: 'aboveBar',
          color: '#dc2626',
          shape: 'arrowDown',
          text: markLabel,
        },
      ]);
      markersRef.current = m;
    }

    chart.timeScale().fitContent();
  }, [data, chartType, showVolume, interval, chartKey, markIndex, markLabel]);

  const candles = toLwcCandles(data, interval);

  if (!candles.length) {
    return (
      <div
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text3)',
          fontSize: '0.85rem',
        }}
      >
        No OHLC history to chart
      </div>
    );
  }

  return <div ref={containerRef} style={{ width: '100%', height }} />;
}

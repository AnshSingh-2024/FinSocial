import React, { useMemo, useRef, useEffect, useState } from 'react';

/** OHLC candles: date (label string), open, high, low, close */
export default function CandlestickChart({
  data = [],
  height = 280,
  markDate = null,
  markIndex = -1,
  markLabel = 'Trade',
  maxXLabels = 8,
  chartKey = '',
}) {
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(640);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setWidth(Math.max(el.offsetWidth || 640, 200));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const candles = useMemo(
    () =>
      (Array.isArray(data) ? data : []).filter(
        (d) => d && Number.isFinite(d.high) && Number.isFinite(d.low) && Number.isFinite(d.open) && Number.isFinite(d.close),
      ),
    [data],
  );

  const [hoverIdx, setHoverIdx] = useState(null);

  const layout = useMemo(() => {
    if (!candles.length) return null;
    let min = Infinity;
    let max = -Infinity;
    candles.forEach((c) => {
      min = Math.min(min, c.low);
      max = Math.max(max, c.high);
    });
    const span = max - min;
    const pad = span > 0 ? span * 0.06 : Math.abs(min) * 0.02 || 1;
    const yMin = min - pad;
    const yMax = max + pad;
    const pl = 42;
    const pr = 8;
    const pt = 12;
    const pb = 36;
    const innerW = Math.max(width - pl - pr, 80);
    const innerH = height - pt - pb;
    const n = candles.length;
    const slot = innerW / n;
    const toY = (v) => pt + innerH - ((Number(v) - yMin) / (yMax - yMin || 1)) * innerH;
    const markIx =
      markIndex >= 0 && markIndex < n
        ? markIndex
        : markDate
          ? candles.findIndex((c) => c.date === markDate)
          : -1;

    const labelStep = Math.max(1, Math.ceil(n / Math.max(4, Math.min(maxXLabels, Math.floor(innerW / 52)))));
    const xLabelIndices = [];
    for (let i = 0; i < n; i += labelStep) xLabelIndices.push(i);
    if (n > 1 && (!xLabelIndices.length || xLabelIndices[xLabelIndices.length - 1] !== n - 1)) {
      if (xLabelIndices[xLabelIndices.length - 1] !== n - 1) xLabelIndices.push(n - 1);
    }

    return { yMin, yMax, pl, pr, pt, pb, innerW, innerH, slot, toY, n, markIx, xLabelIndices };
  }, [candles, width, height, markDate, markIndex, maxXLabels]);

  const onMove = (e) => {
    if (!layout) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ix = Math.floor((x - layout.pl) / layout.slot);
    if (ix >= 0 && ix < candles.length) setHoverIdx(ix);
    else setHoverIdx(null);
  };

  const tipIdx = hoverIdx;

  if (!layout || !candles.length) {
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

  const { pl, pr, pt, pb, innerH, innerW, slot, toY, markIx, xLabelIndices } = layout;
  const bw = Math.min(Math.max(slot * 0.72, 2), 16);
  const axisColor = 'var(--text3, #888)';
  const fontPx = Math.min(10, Math.max(8, slot * 0.35));

  return (
    <div ref={wrapRef} style={{ width: '100%', height, position: 'relative' }}>
      <svg key={chartKey || data.length} width={width} height={height} style={{ display: 'block' }} onMouseMove={onMove} onMouseLeave={() => setHoverIdx(null)}>
        <line x1={pl} y1={pt + innerH} x2={pl + innerW} y2={pt + innerH} stroke={axisColor} strokeWidth={1} opacity={0.85} />

        {[0.25, 0.5, 0.75].map((t) => {
          const gy = pt + innerH * (1 - t);
          return (
            <line key={t} x1={pl} x2={pl + innerW} y1={gy} y2={gy} stroke="var(--border)" strokeDasharray="4 6" opacity={0.6} />
          );
        })}

        {xLabelIndices.map((i) => {
          const x = pl + i * slot + slot / 2;
          const label = candles[i]?.date || '';
          return (
            <text
              key={`xlab-${i}`}
              x={Math.min(pl + innerW - 2, Math.max(pl + 2, x))}
              y={height - 6}
              textAnchor={i === 0 ? 'start' : i === candles.length - 1 ? 'end' : 'middle'}
              fill={axisColor}
              fontSize={fontPx}
              style={{ pointerEvents: 'none' }}
            >
              {label}
            </text>
          );
        })}

        {candles.map((c, i) => {
          const cx = pl + i * slot + slot / 2;
          const yHigh = toY(c.high);
          const yLow = toY(c.low);
          const yOpen = toY(c.open);
          const yClose = toY(c.close);
          const top = Math.min(yOpen, yClose);
          const bot = Math.max(yOpen, yClose);
          const bull = c.close >= c.open;
          const col = bull ? '#16a34a' : '#dc2626';
          const bodyH = Math.max(bot - top, 1.5);
          return (
            <g key={`${i}-${c.date}`}>
              <line x1={cx} x2={cx} y1={yHigh} y2={yLow} stroke={col} strokeWidth={1.25} />
              <rect
                x={cx - bw / 2}
                y={top}
                width={bw}
                height={bodyH}
                fill={bull ? 'rgba(22,163,74,0.25)' : 'rgba(220,38,38,0.3)'}
                stroke={col}
                strokeWidth={1.25}
                rx={1}
              />
            </g>
          );
        })}

        {markIx >= 0 && (
          <g>
            <line
              x1={pl + markIx * slot + slot / 2}
              x2={pl + markIx * slot + slot / 2}
              y1={pt}
              y2={pt + innerH}
              stroke="#dc2626"
              strokeWidth={1}
              strokeDasharray="5 5"
              opacity={0.9}
            />
            <text x={pl + markIx * slot + slot / 2 + 4} y={pt + 14} fill="#dc2626" fontSize={10} fontWeight={600}>
              {markLabel}
            </text>
          </g>
        )}
      </svg>
      {tipIdx != null && candles[tipIdx] && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(Math.max(pl + tipIdx * slot + slot / 2 - 70, 4), width - 148),
            top: 6,
            background: 'var(--card, #fff)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '6px 10px',
            fontSize: 11,
            pointerEvents: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            zIndex: 2,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 4 }}>{candles[tipIdx].date}</div>
          <div className="mono">O {candles[tipIdx].open?.toFixed(2)} H {candles[tipIdx].high?.toFixed(2)}</div>
          <div className="mono">L {candles[tipIdx].low?.toFixed(2)} C {candles[tipIdx].close?.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
}

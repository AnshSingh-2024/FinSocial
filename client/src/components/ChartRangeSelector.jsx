import React from 'react';

export const CHART_RANGES = [
  { id: '1d', label: '1D' },
  { id: '1w', label: '1W' },
  { id: '1m', label: '1M' },
  { id: '3m', label: '3M' },
  { id: '1y', label: '1Y' },
  { id: '2y', label: '2Y' },
];

export default function ChartRangeSelector({ value, onChange, className = '' }) {
  return (
    <div className={`chart-range-tabs ${className}`.trim()} role="group" aria-label="Chart time range">
      {CHART_RANGES.map((r) => (
        <button
          key={r.id}
          type="button"
          className={`lb-tab ${value === r.id ? 'active' : ''}`}
          onClick={() => onChange(r.id)}
          aria-pressed={value === r.id}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

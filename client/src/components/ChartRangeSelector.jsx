import { CHART_RANGES } from '../constants/chartRanges';

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

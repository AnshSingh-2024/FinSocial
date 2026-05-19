import { CHART_TYPES } from '../constants/chartTypes';

export default function ChartTypeSelector({ value, onChange, showVolume, onVolumeToggle, className = '' }) {
  return (
    <div
      className={`chart-type-tabs ${className}`.trim()}
      role="group"
      aria-label="Chart display type"
    >
      {CHART_TYPES.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`lb-tab ${value === t.id ? 'active' : ''}`}
          onClick={() => onChange(t.id)}
          aria-pressed={value === t.id}
        >
          {t.label}
        </button>
      ))}
      {onVolumeToggle && (
        <button
          type="button"
          className={`lb-tab ${showVolume ? 'active' : ''}`}
          onClick={() => onVolumeToggle(!showVolume)}
          aria-pressed={showVolume}
        >
          Vol
        </button>
      )}
    </div>
  );
}

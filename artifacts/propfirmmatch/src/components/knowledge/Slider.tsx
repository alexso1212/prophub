interface Props {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  hint?: string;
}

export default function Slider({ label, min, max, step = 1, value, onChange, format, hint }: Props) {
  return (
    <div className="kg-slider">
      <div className="kg-slider-head">
        <span className="kg-slider-label">{label}</span>
        <span className="kg-slider-value">{format ? format(value) : value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.currentTarget.value))}
      />
      {hint && <div className="kg-slider-hint">{hint}</div>}
    </div>
  );
}

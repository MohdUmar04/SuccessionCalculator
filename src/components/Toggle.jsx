export default function Toggle({ value, onChange, label, hint }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          value ? "bg-accent-500" : "bg-white/10"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
      <div>
        <div className="text-sm font-medium text-ink-100">{label}</div>
        {hint && <div className="text-xs text-ink-300">{hint}</div>}
      </div>
    </label>
  );
}

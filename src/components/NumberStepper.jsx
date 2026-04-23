import { Minus, Plus } from "lucide-react";

export default function NumberStepper({ value, onChange, min = 0, max = 20, label }) {
  const set = (v) => onChange(Math.max(min, Math.min(max, v)));
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
        <button
          type="button"
          onClick={() => set(value - 1)}
          className="w-9 h-9 grid place-items-center rounded-lg hover:bg-white/10 disabled:opacity-40"
          disabled={value <= min}
          aria-label="decrement"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => set(parseInt(e.target.value || "0", 10))}
          className="w-14 text-center bg-transparent outline-none font-semibold"
        />
        <button
          type="button"
          onClick={() => set(value + 1)}
          className="w-9 h-9 grid place-items-center rounded-lg hover:bg-white/10 disabled:opacity-40"
          disabled={value >= max}
          aria-label="increment"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

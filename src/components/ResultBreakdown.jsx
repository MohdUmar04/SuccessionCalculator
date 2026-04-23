import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const PALETTE = [
  "#f97316",
  "#fb923c",
  "#fbbf24",
  "#a3e635",
  "#34d399",
  "#22d3ee",
  "#60a5fa",
  "#818cf8",
  "#c084fc",
  "#f472b6",
  "#fda4af",
  "#f87171",
];

function formatCurrency(n, currency = "INR") {
  if (!isFinite(n)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

export default function ResultBreakdown({ result, estate, currency = "INR" }) {
  if (!result) return null;
  const { shares, notes, title } = result;
  const totalFraction = shares.reduce((s, x) => s + x.fraction, 0);
  const safeTotal = totalFraction > 0 ? totalFraction : 1;

  if (shares.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-strong p-6 md:p-8 space-y-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-400/15 border border-yellow-400/20 grid place-items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold">{title || "No heirs identified"}</h3>
            <p className="text-ink-300 text-sm mt-1">
              Add at least one heir (spouse, child, parent, sibling or kin) to see the computed
              shares.
            </p>
          </div>
        </div>
        {notes && notes.length > 0 && (
          <div className="rounded-xl bg-yellow-400/5 border border-yellow-400/20 p-4">
            <ul className="list-disc list-inside space-y-1 text-sm text-ink-100">
              {notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    );
  }

  const chartData = shares.map((s) => ({
    name: s.heir,
    value: s.fraction,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-strong p-6 md:p-8 space-y-6"
    >
      <div>
        <h3 className="font-display text-2xl font-bold">{title || "Result"}</h3>
        <p className="text-ink-300 text-sm mt-1">
          Shares are computed per the Indian Succession Act, 1925. Fractions are normalised over {safeTotal.toFixed(4)} parts.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="h-64 md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={2}
                stroke="rgba(255,255,255,0.1)"
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(10,12,23,0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  color: "#fff",
                }}
                formatter={(v, n) => [`${((v / safeTotal) * 100).toFixed(2)}%`, n]}
              />
              <Legend
                wrapperStyle={{ color: "#c9cad2", fontSize: 12 }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2 max-h-72 overflow-auto pr-1">
          {shares.map((s, i) => {
            const pct = (s.fraction / safeTotal) * 100;
            const amount = estate ? (estate * s.fraction) / safeTotal : null;
            return (
              <motion.div
                key={s.heir + i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: PALETTE[i % PALETTE.length] }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-ink-50">{s.heir}</span>
                    <span className="text-sm font-semibold text-accent-300">{pct.toFixed(2)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-ink-300">
                    <span>{s.rule || ""}</span>
                    {amount != null && <span>{formatCurrency(amount, currency)}</span>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {notes && notes.length > 0 && (
        <div className="rounded-xl bg-accent-500/10 border border-accent-500/20 p-4">
          <div className="text-sm font-semibold text-accent-300 mb-2">Applied rules</div>
          <ul className="list-disc list-inside space-y-1 text-sm text-ink-100">
            {notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

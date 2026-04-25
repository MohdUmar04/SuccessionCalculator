import { motion } from "framer-motion";
import { AlertTriangle, FileText, ShieldAlert } from "lucide-react";
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

const Disclaimer = () => (
  <div className="rounded-xl border border-rose-400/30 bg-rose-500/5 p-4 text-xs text-rose-200">
    <span className="font-semibold">Disclaimer:</span> This calculation is for
    informational purposes only and does not constitute professional legal
    advice. Distribution under the Indian Succession Act, 1925 may vary based on
    the full family structure, degree of kindred and judicial interpretation.
    Kindly consult a qualified professional before acting on this result.
  </div>
);

export default function ResultBreakdown({ result, currency = "INR" }) {
  if (!result) return null;
  const {
    title,
    shares = [],
    notes = [],
    nomineeHeirs = [],
    fullWill = false,
    s53Triggered = false,
    totalEstate = 0,
    grossEstate = 0,
  } = result;

  const totalAmount = shares.reduce((s, x) => s + (x.amount || 0), 0);
  const safeTotal = totalAmount > 0 ? totalAmount : 1;

  if (fullWill) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="glass-strong p-6 md:p-8 space-y-5"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-500/15 border border-accent-400/20 grid place-items-center">
            <FileText className="w-5 h-5 text-accent-300" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold">
              Full Will is present
            </h3>
            <p className="text-ink-300 text-sm mt-1">
              Distribution will follow the terms of the will. Intestate rules do
              not apply.
            </p>
          </div>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-sm text-ink-100">
          <span className="text-ink-300">Total Estate</span>
          <div className="font-display text-2xl font-bold mt-1">
            {formatCurrency(totalEstate, currency)}
          </div>
        </div>
        {nomineeHeirs.length > 0 && (
          <NomineeBlock heirs={nomineeHeirs} currency={currency} />
        )}
        <Disclaimer />
      </motion.div>
    );
  }

  if (shares.length === 0 && nomineeHeirs.length === 0) {
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
            <h3 className="font-display text-xl font-bold">
              {title || "Enter assets to compute distribution"}
            </h3>
            <p className="text-ink-300 text-sm mt-1">
              {totalEstate <= 0
                ? "Add at least one positive asset (house, bank, insurance or pension) to see the breakdown."
                : "Add at least one heir (spouse, child, parent, sibling) to see the computed shares."}
            </p>
          </div>
        </div>
        {notes.length > 0 && (
          <div className="rounded-xl bg-yellow-400/5 border border-yellow-400/20 p-4">
            <ul className="list-disc list-inside space-y-1 text-sm text-ink-100">
              {notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </div>
        )}
        <Disclaimer />
      </motion.div>
    );
  }

  const chartData = shares.map((s) => ({
    name: s.heir,
    value: Math.max(0, s.amount || 0),
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
        <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <div className="text-ink-300 text-xs uppercase tracking-wide">
              Total Estate (after gift / will)
            </div>
            <div className="font-display text-2xl font-bold mt-1">
              {formatCurrency(totalEstate, currency)}
            </div>
          </div>
          {grossEstate !== totalEstate && (
            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
              <div className="text-ink-300 text-xs uppercase tracking-wide">
                Gross estate (before will)
              </div>
              <div className="font-display text-2xl font-bold mt-1 text-ink-200">
                {formatCurrency(grossEstate, currency)}
              </div>
            </div>
          )}
        </div>
      </div>

      {shares.length > 0 && (
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
                  formatter={(v, n) => [
                    `${formatCurrency(v, currency)} (${((v / safeTotal) * 100).toFixed(2)}%)`,
                    n,
                  ]}
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
              const pct = (s.amount / safeTotal) * 100;
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
                      <span className="text-sm font-semibold text-accent-300">
                        {formatCurrency(s.amount, currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-ink-300">
                      <span>{s.rule || ""}</span>
                      <span>{pct.toFixed(2)}%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {s53Triggered && (
        <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 flex gap-3 text-sm text-rose-100">
          <ShieldAlert className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
          <p>
            <span className="font-semibold">Note:</span> Kindly contact a
            professional. The distribution of residue shall take place in
            accordance with Sections 54, 55, 56 and Schedule II of the Indian
            Succession Act.
          </p>
        </div>
      )}

      {nomineeHeirs.length > 0 && (
        <NomineeBlock heirs={nomineeHeirs} currency={currency} />
      )}

      {notes.length > 0 && (
        <div className="rounded-xl bg-accent-500/10 border border-accent-500/20 p-4">
          <div className="text-sm font-semibold text-accent-300 mb-2">
            Applied rules
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-ink-100">
            {notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}

      <Disclaimer />
    </motion.div>
  );
}

function NomineeBlock({ heirs, currency }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
      <div className="text-sm font-semibold mb-2">
        Nominee allocations (outside estate)
      </div>
      <div className="space-y-2">
        {heirs.map((n, i) => (
          <div
            key={n.heir + i}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-ink-100">{n.heir}</span>
            <span className="font-semibold text-accent-300">
              {formatCurrency(n.amount, currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Cross, Info, RotateCcw } from "lucide-react";
import NumberStepper from "../components/NumberStepper";
import Toggle from "../components/Toggle";
import ResultBreakdown from "../components/ResultBreakdown";
import { computeChristian } from "../logic/christian";

const initialState = {
  estate: "",
  isIndianChristian: true,
  spouseAlive: true,
  livingChildren: 2,
  predeceasedChildCount: 0,
  predeceasedChildren: [],
  fatherAlive: false,
  motherAlive: false,
  siblings: 0,
  predeceasedSiblingCount: 0,
  predeceasedSiblings: [],
  nextOfKin: 0,
};

export default function ChristianCalculator() {
  const [state, setState] = useState(initialState);
  const patch = (p) => setState((s) => ({ ...s, ...p }));

  const predeceasedChildren = useMemo(() => {
    const arr = [...state.predeceasedChildren];
    while (arr.length < state.predeceasedChildCount) arr.push({ descendants: 1 });
    arr.length = state.predeceasedChildCount;
    return arr;
  }, [state.predeceasedChildren, state.predeceasedChildCount]);

  const predeceasedSiblings = useMemo(() => {
    const arr = [...state.predeceasedSiblings];
    while (arr.length < state.predeceasedSiblingCount) arr.push({ descendants: 1 });
    arr.length = state.predeceasedSiblingCount;
    return arr;
  }, [state.predeceasedSiblings, state.predeceasedSiblingCount]);

  const updateChild = (idx, p) => {
    const next = predeceasedChildren.map((s, i) => (i === idx ? { ...s, ...p } : s));
    patch({ predeceasedChildren: next });
  };
  const updateSibling = (idx, p) => {
    const next = predeceasedSiblings.map((s, i) => (i === idx ? { ...s, ...p } : s));
    patch({ predeceasedSiblings: next });
  };

  const result = useMemo(() => {
    return computeChristian({
      estate: parseFloat(state.estate) || 0,
      isIndianChristian: state.isIndianChristian,
      spouseAlive: state.spouseAlive,
      livingChildren: state.livingChildren,
      predeceasedChildren,
      fatherAlive: state.fatherAlive,
      motherAlive: state.motherAlive,
      siblings: state.siblings,
      predeceasedSiblings,
      nextOfKin: state.nextOfKin,
    });
  }, [state, predeceasedChildren, predeceasedSiblings]);

  const estateNum = parseFloat(state.estate) || 0;

  const hasLineal =
    state.livingChildren > 0 ||
    predeceasedChildren.some((c) => c.descendants > 0);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="chip mb-3">
            <Cross className="w-3.5 h-3.5 text-accent-300" />
            Sections 31–49, Indian Succession Act, 1925
          </div>
          <h1 className="section-title">Christian Succession Calculator</h1>
          <p className="text-ink-300 mt-2 max-w-2xl">
            Compute the intestate division across spouse, lineal descendants and kindred — including
            Section 33A (Indian Christian widow with no descendants).
          </p>
        </div>
        <button className="btn-ghost" onClick={() => setState(initialState)}>
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </header>

      <div className="grid lg:grid-cols-5 gap-8">
        <form className="lg:col-span-3 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <Section title="The deceased" description="Christian who died without a valid will.">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Estate value (optional, ₹)</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="Needed for Section 33A threshold"
                  value={state.estate}
                  onChange={(e) => patch({ estate: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <Toggle
                  value={state.isIndianChristian}
                  onChange={(v) => patch({ isIndianChristian: v })}
                  label="Indian Christian"
                  hint="Enables Section 33A (₹5,000 threshold) where applicable."
                />
              </div>
            </div>
          </Section>

          <Section title="Spouse" description="Section 33 / 33A / 34 depending on heirs.">
            <Toggle
              value={state.spouseAlive}
              onChange={(v) => patch({ spouseAlive: v })}
              label="Widow or widower is alive"
            />
          </Section>

          <Section title="Lineal descendants">
            <div className="grid sm:grid-cols-2 gap-4">
              <NumberStepper
                label="Living children"
                value={state.livingChildren}
                onChange={(v) => patch({ livingChildren: v })}
              />
              <NumberStepper
                label="Predeceased children (with their own children)"
                value={state.predeceasedChildCount}
                onChange={(v) => patch({ predeceasedChildCount: v })}
              />
            </div>
            <AnimatePresence>
              {predeceasedChildren.map((pc, idx) => (
                <motion.div
                  key={`pc-${idx}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="text-sm font-semibold mb-3">Predeceased child {idx + 1}</div>
                  <NumberStepper
                    label="Living grandchildren from this child"
                    value={pc.descendants}
                    onChange={(v) => updateChild(idx, { descendants: v })}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </Section>

          {!hasLineal && (
            <Section
              title="Kindred (no lineal descendants)"
              description="Applied under Sections 42–48."
            >
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Toggle
                  value={state.fatherAlive}
                  onChange={(v) => patch({ fatherAlive: v })}
                  label="Father is alive"
                />
                <Toggle
                  value={state.motherAlive}
                  onChange={(v) => patch({ motherAlive: v })}
                  label="Mother is alive"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <NumberStepper
                  label="Living siblings"
                  value={state.siblings}
                  onChange={(v) => patch({ siblings: v })}
                />
                <NumberStepper
                  label="Predeceased siblings (with children)"
                  value={state.predeceasedSiblingCount}
                  onChange={(v) => patch({ predeceasedSiblingCount: v })}
                />
              </div>
              <AnimatePresence>
                {predeceasedSiblings.map((sb, idx) => (
                  <motion.div
                    key={`sib-${idx}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="text-sm font-semibold mb-3">Predeceased sibling {idx + 1}</div>
                    <NumberStepper
                      label="Children of this sibling"
                      value={sb.descendants}
                      onChange={(v) => updateSibling(idx, { descendants: v })}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="mt-4">
                <NumberStepper
                  label="Other next-of-kin groups (Section 48)"
                  value={state.nextOfKin}
                  onChange={(v) => patch({ nextOfKin: v })}
                />
                <p className="text-xs text-ink-300 mt-2">
                  Used only when no parent, sibling or descendant of a sibling exists.
                </p>
              </div>
            </Section>
          )}
        </form>

        <aside className="lg:col-span-2 space-y-6 lg:sticky lg:top-24 self-start">
          <div className="glass p-5 flex items-start gap-3">
            <Calculator className="w-5 h-5 text-accent-300 mt-0.5" />
            <p className="text-sm text-ink-200">
              Enter the estate value to unlock the Section 33A split. Otherwise a Section 34 half-and-half
              is shown as a fallback.
            </p>
          </div>

          <ResultBreakdown result={result} estate={estateNum} />

          <div className="glass p-5 text-xs text-ink-300 flex gap-3">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-accent-300" />
            <p>
              This calculator covers the principal rules. Special cases — illegitimate children,
              adoption, conversion, and property domiciled abroad — are not modelled here and should
              be referred to counsel.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, description, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="glass p-6 space-y-4"
    >
      <div>
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        {description && <p className="text-sm text-ink-300 mt-1">{description}</p>}
      </div>
      {children}
    </motion.section>
  );
}

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Info, RotateCcw, Users } from "lucide-react";
import NumberStepper from "../components/NumberStepper";
import Toggle from "../components/Toggle";
import ResultBreakdown from "../components/ResultBreakdown";
import { computeParsi } from "../logic/parsi";

const initialState = {
  // assets
  house: "",
  bank: "",
  insurance: "",
  pension: "",
  gift: "",
  insNominee: "",
  penNominee: "",
  nomineeOverride: false,

  // will
  willPresent: false,
  partialWill: false,
  willPercent: "",

  // family
  spouseAlive: true,
  totalChildren: 2,
  predeceasedChildCount: 0,
  predeceasedChildren: [],

  fatherAlive: false,
  motherAlive: false,

  totalSiblings: 0,
  predeceasedSiblingCount: 0,
  predeceasedSiblings: [],
};

const blankPredeceasedChild = () => ({
  type: "son",
  widow: false,
  branchCount: 0,
  predeceasedGCCount: 0,
  predeceasedGrandchildren: [],
});

export default function ParsiCalculator() {
  const [state, setState] = useState(initialState);
  const patch = (p) => setState((s) => ({ ...s, ...p }));

  const predeceasedChildren = useMemo(() => {
    const arr = state.predeceasedChildren.map((c) => ({
      ...blankPredeceasedChild(),
      ...c,
    }));
    while (arr.length < state.predeceasedChildCount) arr.push(blankPredeceasedChild());
    arr.length = state.predeceasedChildCount;
    return arr.map((c) => {
      const gcArr = [...(c.predeceasedGrandchildren || [])];
      while (gcArr.length < c.predeceasedGCCount) gcArr.push({ count: 0 });
      gcArr.length = c.predeceasedGCCount;
      return { ...c, predeceasedGrandchildren: gcArr };
    });
  }, [state.predeceasedChildren, state.predeceasedChildCount]);

  const predeceasedSiblings = useMemo(() => {
    const arr = [...state.predeceasedSiblings];
    while (arr.length < state.predeceasedSiblingCount) arr.push({ branchCount: 0 });
    arr.length = state.predeceasedSiblingCount;
    return arr;
  }, [state.predeceasedSiblings, state.predeceasedSiblingCount]);

  const updateChild = (idx, p) => {
    const next = predeceasedChildren.map((c, i) => (i === idx ? { ...c, ...p } : c));
    patch({ predeceasedChildren: next });
  };

  const updateGrandchild = (childIdx, gIdx, p) => {
    const next = predeceasedChildren.map((c, i) => {
      if (i !== childIdx) return c;
      const gcs = c.predeceasedGrandchildren.map((g, j) =>
        j === gIdx ? { ...g, ...p } : g,
      );
      return { ...c, predeceasedGrandchildren: gcs };
    });
    patch({ predeceasedChildren: next });
  };

  const updateSibling = (idx, p) => {
    const next = predeceasedSiblings.map((s, i) => (i === idx ? { ...s, ...p } : s));
    patch({ predeceasedSiblings: next });
  };

  const num = (v) => (v === "" || v == null ? 0 : Math.max(0, Number(v) || 0));

  const result = useMemo(() => {
    return computeParsi({
      house: num(state.house),
      bank: num(state.bank),
      insurance: num(state.insurance),
      pension: num(state.pension),
      gift: num(state.gift),
      insNominee: state.insNominee,
      penNominee: state.penNominee,
      nomineeOverride: state.nomineeOverride,
      willPresent: state.willPresent,
      partialWill: state.partialWill,
      willPercent: num(state.willPercent),
      spouseAlive: state.spouseAlive,
      totalChildren: state.totalChildren,
      predeceasedChildren,
      fatherAlive: state.fatherAlive,
      motherAlive: state.motherAlive,
      siblings: state.totalSiblings,
      predeceasedSiblings,
    });
  }, [state, predeceasedChildren, predeceasedSiblings]);

  const totalChildrenSafe = Math.max(state.predeceasedChildCount, state.totalChildren);
  const livingChildren = Math.max(0, totalChildrenSafe - state.predeceasedChildCount);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="chip mb-3">
            <Users className="w-3.5 h-3.5 text-accent-300" />
            Sections 50–56, Indian Succession Act, 1925
          </div>
          <h1 className="section-title">Parsi Succession Calculator</h1>
          <p className="text-ink-300 mt-2 max-w-2xl">
            Enter the deceased's assets, lifetime gifts, will status and family
            structure. Shares update live with rupee amounts and percentages.
          </p>
        </div>
        <button
          className="btn-ghost self-start md:self-end"
          onClick={() => setState(initialState)}
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </header>

      <div className="grid lg:grid-cols-5 gap-8">
        <form
          className="lg:col-span-3 space-y-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <Section title="Assets" description="Estate is house + bank + insurance + pension − lifetime gifts.">
            <div className="grid sm:grid-cols-2 gap-4">
              <CurrencyField
                label="House value (₹)"
                value={state.house}
                onChange={(v) => patch({ house: v })}
              />
              <CurrencyField
                label="Bank balance (₹)"
                value={state.bank}
                onChange={(v) => patch({ bank: v })}
              />
              <CurrencyField
                label="Insurance (₹)"
                value={state.insurance}
                onChange={(v) => patch({ insurance: v })}
              />
              <CurrencyField
                label="Pension (₹)"
                value={state.pension}
                onChange={(v) => patch({ pension: v })}
              />
              <CurrencyField
                label="Gifts made during lifetime (₹)"
                value={state.gift}
                onChange={(v) => patch({ gift: v })}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="label">Insurance nominee</label>
                <input
                  className="input"
                  value={state.insNominee}
                  onChange={(e) => patch({ insNominee: e.target.value })}
                  placeholder="Name (optional)"
                />
              </div>
              <div>
                <label className="label">Pension nominee</label>
                <input
                  className="input"
                  value={state.penNominee}
                  onChange={(e) => patch({ penNominee: e.target.value })}
                  placeholder="Name (optional)"
                />
              </div>
            </div>

            <div className="pt-2">
              <Toggle
                value={state.nomineeOverride}
                onChange={(v) => patch({ nomineeOverride: v })}
                label="Nominee gets the asset directly"
                hint="Insurance and pension proceeds bypass the estate when on."
              />
            </div>
          </Section>

          <Section title="Will" description="Full will short-circuits the calculation; a partial will trims the residue.">
            <div className="space-y-3">
              <Toggle
                value={state.willPresent}
                onChange={(v) =>
                  patch({
                    willPresent: v,
                    ...(v ? { partialWill: false } : {}),
                  })
                }
                label="Full will is present"
                hint="Distribution will follow the will entirely."
              />
              <Toggle
                value={state.partialWill}
                onChange={(v) =>
                  patch({
                    partialWill: v,
                    ...(v ? { willPresent: false } : {}),
                  })
                }
                label="Partial will is present"
                hint="A portion of the estate is governed by the will."
              />
              {state.partialWill && (
                <div className="max-w-xs">
                  <label className="label">Estate covered by will (%)</label>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    max="100"
                    value={state.willPercent}
                    onChange={(e) => patch({ willPercent: e.target.value })}
                    placeholder="e.g. 40"
                  />
                </div>
              )}
            </div>
          </Section>

          <Section title="Spouse">
            <Toggle
              value={state.spouseAlive}
              onChange={(v) => patch({ spouseAlive: v })}
              label="Spouse is alive"
              hint="Takes one equal share alongside each child."
            />
          </Section>

          <Section title="Children" description="Predeceased children pass their share to widow / descendants under Section 53.">
            <div className="grid sm:grid-cols-2 gap-4">
              <NumberStepper
                label="Total children"
                value={state.totalChildren}
                onChange={(v) =>
                  patch({
                    totalChildren: v,
                    predeceasedChildCount: Math.min(state.predeceasedChildCount, v),
                  })
                }
              />
              <NumberStepper
                label="Predeceased children"
                value={state.predeceasedChildCount}
                onChange={(v) =>
                  patch({
                    predeceasedChildCount: Math.min(v, state.totalChildren),
                  })
                }
                max={state.totalChildren}
              />
            </div>
            <p className="text-xs text-ink-300 mt-1">
              Living children: <span className="font-semibold">{livingChildren}</span>
            </p>

            <AnimatePresence>
              {predeceasedChildren.map((pc, idx) => (
                <motion.div
                  key={`pc-${idx}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 space-y-4"
                >
                  <div className="text-sm font-semibold">
                    Predeceased child {idx + 1}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Was a son or daughter?</label>
                      <div className="inline-flex rounded-xl bg-white/5 border border-white/10 p-1">
                        {[
                          { v: "son", l: "Son" },
                          { v: "daughter", l: "Daughter" },
                        ].map((o) => (
                          <button
                            key={o.v}
                            type="button"
                            onClick={() =>
                              updateChild(idx, {
                                type: o.v,
                                widow: o.v === "son" ? pc.widow : false,
                              })
                            }
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                              pc.type === o.v
                                ? "bg-accent-500 text-ink-900"
                                : "text-ink-200"
                            }`}
                          >
                            {o.l}
                          </button>
                        ))}
                      </div>
                    </div>
                    {pc.type === "son" && (
                      <div className="flex items-end">
                        <Toggle
                          value={pc.widow}
                          onChange={(v) => updateChild(idx, { widow: v })}
                          label="His widow is alive"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <NumberStepper
                      label="Children in this branch"
                      value={pc.branchCount}
                      onChange={(v) =>
                        updateChild(idx, {
                          branchCount: v,
                          predeceasedGCCount: Math.min(pc.predeceasedGCCount, v),
                        })
                      }
                    />
                    <NumberStepper
                      label="Predeceased grandchildren"
                      value={pc.predeceasedGCCount}
                      max={pc.branchCount}
                      onChange={(v) =>
                        updateChild(idx, {
                          predeceasedGCCount: Math.min(v, pc.branchCount),
                        })
                      }
                    />
                  </div>

                  <AnimatePresence>
                    {pc.predeceasedGrandchildren.map((gc, gIdx) => (
                      <motion.div
                        key={`gc-${idx}-${gIdx}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="p-3 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div className="text-xs font-semibold text-ink-200 mb-2">
                          Predeceased grandchild {gIdx + 1}
                        </div>
                        <NumberStepper
                          label="Children of this grandchild (great-grandchildren)"
                          value={gc.count}
                          onChange={(v) =>
                            updateGrandchild(idx, gIdx, { count: v })
                          }
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </Section>

          <Section title="Parents" description="Each parent takes half of a child's share (Section 51(2)).">
            <div className="flex flex-col sm:flex-row gap-4">
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
          </Section>

          <Section
            title="Siblings"
            description="Used under Section 54 / Schedule II when there are no lineal descendants."
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <NumberStepper
                label="Total siblings"
                value={state.totalSiblings}
                onChange={(v) =>
                  patch({
                    totalSiblings: v,
                    predeceasedSiblingCount: Math.min(
                      state.predeceasedSiblingCount,
                      v,
                    ),
                  })
                }
              />
              <NumberStepper
                label="Predeceased siblings"
                value={state.predeceasedSiblingCount}
                max={state.totalSiblings}
                onChange={(v) =>
                  patch({
                    predeceasedSiblingCount: Math.min(v, state.totalSiblings),
                  })
                }
              />
            </div>
            <AnimatePresence>
              {predeceasedSiblings.map((sb, idx) => (
                <motion.div
                  key={`sb-${idx}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="text-sm font-semibold mb-3">
                    Predeceased sibling {idx + 1}
                  </div>
                  <NumberStepper
                    label="Children of this sibling"
                    value={sb.branchCount}
                    onChange={(v) => updateSibling(idx, { branchCount: v })}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </Section>
        </form>

        <aside className="lg:col-span-2 space-y-6 lg:sticky lg:top-24 self-start">
          <div className="glass p-5 flex items-start gap-3">
            <Calculator className="w-5 h-5 text-accent-300 mt-0.5" />
            <p className="text-sm text-ink-200">
              Live preview of the rupee distribution. Toggling the will, nominee
              or family structure recomputes immediately.
            </p>
          </div>

          <ResultBreakdown result={result} />

          <div className="glass p-5 text-xs text-ink-300 flex gap-3">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-accent-300" />
            <p>
              When a predeceased son leaves only a widow (no descendants), she
              takes one-half of his share under Section 53; the remainder is
              distributed under Sections 54–56 / Schedule II — flagged in the
              result.
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
        {description && (
          <p className="text-sm text-ink-300 mt-1">{description}</p>
        )}
      </div>
      {children}
    </motion.section>
  );
}

function CurrencyField({ label, value, onChange }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        className="input"
        type="number"
        min="0"
        step="1000"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
      />
    </div>
  );
}

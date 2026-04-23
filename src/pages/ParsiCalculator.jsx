import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Info, RotateCcw, Users } from "lucide-react";
import NumberStepper from "../components/NumberStepper";
import Toggle from "../components/Toggle";
import ResultBreakdown from "../components/ResultBreakdown";
import { computeParsi } from "../logic/parsi";

const initialState = {
  deceasedSex: "male",
  estate: "",
  spouseAlive: true,
  livingSons: 1,
  livingDaughters: 1,
  predeceasedSonCount: 0,
  predeceasedDaughterCount: 0,
  predeceasedSons: [],
  predeceasedDaughters: [],
  fatherAlive: false,
  motherAlive: false,
  siblings: 0,
  predeceasedSiblingCount: 0,
  predeceasedSiblings: [],
};

export default function ParsiCalculator() {
  const [state, setState] = useState(initialState);

  const patch = (p) => setState((s) => ({ ...s, ...p }));

  const predeceasedSons = useMemo(() => {
    const arr = [...state.predeceasedSons];
    while (arr.length < state.predeceasedSonCount) arr.push({ widow: true, descendants: 1 });
    arr.length = state.predeceasedSonCount;
    return arr;
  }, [state.predeceasedSons, state.predeceasedSonCount]);

  const predeceasedDaughters = useMemo(() => {
    const arr = [...state.predeceasedDaughters];
    while (arr.length < state.predeceasedDaughterCount) arr.push({ descendants: 1 });
    arr.length = state.predeceasedDaughterCount;
    return arr;
  }, [state.predeceasedDaughters, state.predeceasedDaughterCount]);

  const predeceasedSiblings = useMemo(() => {
    const arr = [...state.predeceasedSiblings];
    while (arr.length < state.predeceasedSiblingCount) arr.push({ descendants: 1 });
    arr.length = state.predeceasedSiblingCount;
    return arr;
  }, [state.predeceasedSiblings, state.predeceasedSiblingCount]);

  const updateSon = (idx, p) => {
    const next = predeceasedSons.map((s, i) => (i === idx ? { ...s, ...p } : s));
    patch({ predeceasedSons: next });
  };
  const updateDaughter = (idx, p) => {
    const next = predeceasedDaughters.map((s, i) => (i === idx ? { ...s, ...p } : s));
    patch({ predeceasedDaughters: next });
  };
  const updateSibling = (idx, p) => {
    const next = predeceasedSiblings.map((s, i) => (i === idx ? { ...s, ...p } : s));
    patch({ predeceasedSiblings: next });
  };

  const result = useMemo(() => {
    return computeParsi({
      deceasedSex: state.deceasedSex,
      spouseAlive: state.spouseAlive,
      livingSons: state.livingSons,
      livingDaughters: state.livingDaughters,
      predeceasedSons,
      predeceasedDaughters,
      fatherAlive: state.fatherAlive,
      motherAlive: state.motherAlive,
      siblings: state.siblings,
      predeceasedSiblings,
    });
  }, [state, predeceasedSons, predeceasedDaughters, predeceasedSiblings]);

  const estateNum = parseFloat(state.estate) || 0;

  const hasLineal =
    state.livingSons + state.livingDaughters > 0 ||
    predeceasedSons.some((s) => s.widow || s.descendants > 0) ||
    predeceasedDaughters.some((d) => d.descendants > 0);

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
            Model the division of a Parsi intestate estate across spouse, children, parents and — when
            there are no lineal descendants — next of kin under Schedule II.
          </p>
        </div>
        <button className="btn-ghost self-start md:self-end" onClick={() => setState(initialState)}>
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </header>

      <div className="grid lg:grid-cols-5 gap-8">
        <form className="lg:col-span-3 space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Intestate */}
          <Section title="The deceased" description="Parsi who died without a valid will.">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Sex of deceased</label>
                <div className="inline-flex rounded-xl bg-white/5 border border-white/10 p-1">
                  {[
                    { v: "male", l: "Male" },
                    { v: "female", l: "Female" },
                  ].map((o) => (
                    <button
                      key={o.v}
                      type="button"
                      onClick={() => patch({ deceasedSex: o.v })}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                        state.deceasedSex === o.v ? "bg-accent-500 text-ink-900" : "text-ink-200"
                      }`}
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-ink-300 mt-2">
                  Division is gender-neutral post the 1991 amendment. Sex affects wording only.
                </p>
              </div>
              <div>
                <label className="label">Estate value (optional, ₹)</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="e.g. 1,00,00,000"
                  value={state.estate}
                  onChange={(e) => patch({ estate: e.target.value })}
                />
              </div>
            </div>
          </Section>

          <Section title="Spouse" description={state.deceasedSex === "male" ? "Widow" : "Widower"}>
            <Toggle
              value={state.spouseAlive}
              onChange={(v) => patch({ spouseAlive: v })}
              label={`${state.deceasedSex === "male" ? "Widow" : "Widower"} is alive`}
              hint="Takes one equal share alongside children."
            />
          </Section>

          <Section title="Children (living)" description="Sons and daughters alive at the date of death.">
            <div className="grid sm:grid-cols-2 gap-4">
              <NumberStepper
                label="Living sons"
                value={state.livingSons}
                onChange={(v) => patch({ livingSons: v })}
              />
              <NumberStepper
                label="Living daughters"
                value={state.livingDaughters}
                onChange={(v) => patch({ livingDaughters: v })}
              />
            </div>
          </Section>

          <Section
            title="Predeceased children"
            description="A predeceased child's share goes to their widow / children (Section 53)."
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <NumberStepper
                label="Predeceased sons"
                value={state.predeceasedSonCount}
                onChange={(v) => patch({ predeceasedSonCount: v })}
              />
              <NumberStepper
                label="Predeceased daughters"
                value={state.predeceasedDaughterCount}
                onChange={(v) => patch({ predeceasedDaughterCount: v })}
              />
            </div>

            <AnimatePresence>
              {predeceasedSons.map((ps, idx) => (
                <motion.div
                  key={`ps-${idx}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 grid sm:grid-cols-2 gap-4"
                >
                  <div className="sm:col-span-2 text-sm font-semibold">Predeceased son {idx + 1}</div>
                  <Toggle
                    value={ps.widow}
                    onChange={(v) => updateSon(idx, { widow: v })}
                    label="His widow is alive"
                  />
                  <NumberStepper
                    label="His living children"
                    value={ps.descendants}
                    onChange={(v) => updateSon(idx, { descendants: v })}
                  />
                </motion.div>
              ))}
              {predeceasedDaughters.map((pd, idx) => (
                <motion.div
                  key={`pd-${idx}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="text-sm font-semibold mb-3">Predeceased daughter {idx + 1}</div>
                  <NumberStepper
                    label="Her living children"
                    value={pd.descendants}
                    onChange={(v) => updateDaughter(idx, { descendants: v })}
                  />
                  <p className="text-xs text-ink-300 mt-2">
                    Under Parsi law a predeceased daughter's widower does not take a share.
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </Section>

          <Section title="Parents" description="Each parent takes half a child's share (Section 51(2)).">
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

          {!hasLineal && (
            <Section
              title="Next of kin (Schedule II)"
              description="Only used when there are no lineal descendants."
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <NumberStepper
                  label="Living siblings"
                  value={state.siblings}
                  onChange={(v) => patch({ siblings: v })}
                />
                <NumberStepper
                  label="Predeceased siblings"
                  value={state.predeceasedSiblingCount}
                  onChange={(v) => patch({ predeceasedSiblingCount: v })}
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
                    <div className="text-sm font-semibold mb-3">Predeceased sibling {idx + 1}</div>
                    <NumberStepper
                      label="Children of this sibling"
                      value={sb.descendants}
                      onChange={(v) => updateSibling(idx, { descendants: v })}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </Section>
          )}
        </form>

        <aside className="lg:col-span-2 space-y-6 lg:sticky lg:top-24 self-start">
          <div className="glass p-5 flex items-start gap-3">
            <Calculator className="w-5 h-5 text-accent-300 mt-0.5" />
            <p className="text-sm text-ink-200">
              The result updates live as you change inputs. Shares are shown both as percentages and
              (if an estate value is entered) rupee amounts.
            </p>
          </div>

          <ResultBreakdown result={result} estate={estateNum} />

          <div className="glass p-5 text-xs text-ink-300 flex gap-3">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-accent-300" />
            <p>
              Schedule II contains a wider ranking of kindred than surfaced here (e.g. half-blood
              siblings, maternal/paternal uncles, grandparents). For the most common scenarios this
              tool models the leading classes; edge cases should be confirmed with counsel.
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

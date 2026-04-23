/*
 * Parsi Intestate Succession — Indian Succession Act, 1925
 * Chapter III, Sections 50–56 (as amended by Act 51 of 1991).
 *
 * Key rules implemented:
 *  • Section 51 (post-1991): widow and each child take equal shares; each
 *    parent takes half of a child's share.
 *  • Section 53: share of a predeceased son goes to his widow and lineal
 *    descendants (same scheme); share of a predeceased daughter goes to her
 *    children equally (her widower takes nothing under Parsi law).
 *  • Section 54 (no lineal descendants): widow takes one-half; residue goes
 *    to Schedule II relatives — parents, siblings, their descendants.
 *  • Section 55 (female intestate): same scheme gender-neutralised.
 *
 * Shares are returned as fractions; the UI normalises to 100 %.
 */

export function computeParsi(input) {
  const {
    deceasedSex = "male",
    spouseAlive = false,
    livingSons = 0,
    livingDaughters = 0,
    predeceasedSons = [], // [{widow:bool, descendants:number}]
    predeceasedDaughters = [], // [{descendants:number}]
    fatherAlive = false,
    motherAlive = false,
    siblings = 0,
    predeceasedSiblings = [], // [{descendants:number}]
  } = input;

  const shares = [];
  const notes = [];
  const spouseLabel =
    deceasedSex === "male" ? "Widow" : "Widower";

  const hasLineal =
    livingSons + livingDaughters > 0 ||
    predeceasedSons.some((s) => s.widow || (s.descendants || 0) > 0) ||
    predeceasedDaughters.some((d) => (d.descendants || 0) > 0);

  if (hasLineal) {
    // Section 51: one share each for spouse and each child; half-share for each parent.
    if (spouseAlive) {
      shares.push({ heir: spouseLabel, fraction: 1, rule: "Section 51 — equal share" });
    }
    for (let i = 0; i < livingSons; i++) {
      shares.push({ heir: `Son ${i + 1}`, fraction: 1, rule: "Section 51 — equal share" });
    }
    for (let i = 0; i < livingDaughters; i++) {
      shares.push({
        heir: `Daughter ${i + 1}`,
        fraction: 1,
        rule: "Section 51 — equal share",
      });
    }

    predeceasedSons.forEach((ps, idx) => {
      const childShare = 1;
      // Section 53(a): distribute as if the predeceased son had died intestate.
      const parts = (ps.widow ? 1 : 0) + (ps.descendants || 0);
      if (parts === 0) return;
      const per = childShare / parts;
      if (ps.widow) {
        shares.push({
          heir: `Widow of predeceased son ${idx + 1}`,
          fraction: per,
          rule: "Section 53(a)",
        });
      }
      for (let k = 0; k < (ps.descendants || 0); k++) {
        shares.push({
          heir: `Child ${k + 1} of predeceased son ${idx + 1}`,
          fraction: per,
          rule: "Section 53(a) — per stirpes",
        });
      }
    });

    predeceasedDaughters.forEach((pd, idx) => {
      const childShare = 1;
      const parts = pd.descendants || 0;
      if (parts === 0) return;
      const per = childShare / parts;
      for (let k = 0; k < parts; k++) {
        shares.push({
          heir: `Child ${k + 1} of predeceased daughter ${idx + 1}`,
          fraction: per,
          rule: "Section 53(b) — equally among her children",
        });
      }
    });

    if (fatherAlive)
      shares.push({ heir: "Father", fraction: 0.5, rule: "Section 51(2) — half of a child's share" });
    if (motherAlive)
      shares.push({ heir: "Mother", fraction: 0.5, rule: "Section 51(2) — half of a child's share" });

    notes.push("Section 51 applied: spouse and each child take equal shares.");
    if (fatherAlive || motherAlive)
      notes.push("Each parent takes half of a child's share (Section 51(2)).");
    if (predeceasedSons.length)
      notes.push("Predeceased son's share distributed under Section 53(a).");
    if (predeceasedDaughters.length)
      notes.push("Predeceased daughter's share distributed equally among her children (Section 53(b)).");
  } else {
    // Section 54 — No lineal descendants.
    if (spouseAlive) {
      shares.push({ heir: spouseLabel, fraction: 0.5, rule: "Section 54(a) — one-half to spouse" });
      notes.push("No lineal descendants: spouse takes one-half (Section 54).");
    }
    const residueFraction = spouseAlive ? 0.5 : 1;

    const kin = [];
    if (fatherAlive) kin.push({ heir: "Father", fraction: 1, rule: "Schedule II — Part I" });
    if (motherAlive) kin.push({ heir: "Mother", fraction: 1, rule: "Schedule II — Part I" });
    for (let i = 0; i < siblings; i++)
      kin.push({ heir: `Sibling ${i + 1}`, fraction: 1, rule: "Schedule II — Part I (full brother/sister)" });
    predeceasedSiblings.forEach((ps, idx) => {
      for (let k = 0; k < (ps.descendants || 0); k++) {
        kin.push({
          heir: `Child ${k + 1} of predeceased sibling ${idx + 1}`,
          fraction: 1 / (ps.descendants || 1),
          rule: "Schedule II — per stirpes",
        });
      }
    });

    const kinTotal = kin.reduce((s, x) => s + x.fraction, 0) || 1;
    kin.forEach((k) =>
      shares.push({ ...k, fraction: (k.fraction / kinTotal) * residueFraction })
    );

    if (kin.length === 0 && spouseAlive) {
      // Spouse takes everything in absence of relatives
      shares[0].fraction = 1;
      notes.push("No Schedule II relatives — spouse takes the entire estate.");
    }
    if (!spouseAlive && kin.length === 0) {
      notes.push("No heirs identified. Property would escheat to the State.");
    } else if (kin.length > 0) {
      notes.push("Residue divided among next of kin per Schedule II.");
    }
  }

  return {
    title:
      deceasedSex === "male"
        ? "Parsi male intestate — computed shares"
        : "Parsi female intestate — computed shares",
    shares,
    notes,
  };
}

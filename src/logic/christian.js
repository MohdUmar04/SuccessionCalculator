/*
 * Christian Intestate Succession — Indian Succession Act, 1925
 * Part V, Chapter II, Sections 31–49.
 *
 * Rules implemented:
 *  • Section 33: widow + lineal descendants → 1/3 to widow, 2/3 to descendants.
 *  • Section 33A: Indian Christian with widow but no lineal descendants; if
 *    net value ≤ ₹5,000 widow takes all, else ₹5,000 + 1/2 of remainder to
 *    widow and the other half to kindred.
 *  • Section 34: widow + kindred (no descendants) → 1/2 and 1/2.
 *  • Section 35: widower has same rights as widow.
 *  • Sections 36–40: per-stirpes distribution among descendants.
 *  • Sections 41–48: distribution among kindred where no descendants exist.
 */

const RUPEE = "\u20B9";

export function computeChristian(input) {
  const {
    estate = 0,
    isIndianChristian = false,
    spouseAlive = false,
    livingChildren = 0,
    predeceasedChildren = [], // [{descendants: number}]
    fatherAlive = false,
    motherAlive = false,
    siblings = 0,
    predeceasedSiblings = [], // [{descendants:number}]
    nextOfKin = 0,
  } = input;

  const shares = [];
  const notes = [];

  const totalDescendantGroups =
    livingChildren + predeceasedChildren.filter((c) => (c.descendants || 0) > 0).length;

  const hasLineal = totalDescendantGroups > 0;

  if (spouseAlive && hasLineal) {
    // Section 33 — widow 1/3, descendants 2/3
    shares.push({ heir: "Widow/Widower", fraction: 1 / 3, rule: "Section 33 — one-third to spouse" });
    distributeDescendants(2 / 3, livingChildren, predeceasedChildren, shares);
    notes.push("Section 33 applied: spouse takes one-third; lineal descendants share two-thirds.");
    notes.push("Descendants divided per stirpes (Sections 37–40).");
  } else if (!spouseAlive && hasLineal) {
    // Section 41 — descendants take the entire estate
    distributeDescendants(1, livingChildren, predeceasedChildren, shares);
    notes.push("Section 41: no spouse — descendants take the whole estate per stirpes.");
  } else if (spouseAlive && !hasLineal) {
    if (isIndianChristian) {
      // Section 33A
      if (estate > 0 && estate <= 5000) {
        shares.push({
          heir: "Widow/Widower",
          fraction: 1,
          rule: `Section 33A — estate \u2264 ${RUPEE}5,000, entire to spouse`,
        });
        notes.push("Section 33A applied: estate value ≤ ₹5,000, spouse takes all.");
      } else if (estate > 5000) {
        const widowAmount = 5000 + (estate - 5000) / 2;
        const kindredAmount = estate - widowAmount;
        shares.push({
          heir: "Widow/Widower",
          fraction: widowAmount / estate,
          rule: `Section 33A — ${RUPEE}5,000 + half of remainder`,
        });
        const kindred = collectKindred({
          fatherAlive,
          motherAlive,
          siblings,
          predeceasedSiblings,
          nextOfKin,
        });
        const kinTotal = kindred.reduce((s, k) => s + k.fraction, 0) || 1;
        kindred.forEach((k) =>
          shares.push({ ...k, fraction: (k.fraction / kinTotal) * (kindredAmount / estate) })
        );
        notes.push("Section 33A: widow takes ₹5,000 + 1/2 of remainder; kindred share the rest.");
      } else {
        // Estate value unknown — apply Section 34 split.
        applySection34(shares, {
          fatherAlive,
          motherAlive,
          siblings,
          predeceasedSiblings,
          nextOfKin,
        });
        notes.push(
          "Section 33A needs an estate value to compute the ₹5,000 threshold. Defaulted to Section 34 (½–½)."
        );
      }
    } else {
      // Section 34 — widow 1/2, kindred 1/2
      applySection34(shares, {
        fatherAlive,
        motherAlive,
        siblings,
        predeceasedSiblings,
        nextOfKin,
      });
      notes.push("Section 34: spouse takes one-half; kindred share the other half.");
    }
  } else if (!spouseAlive && !hasLineal) {
    // Sections 42–48
    const kindred = collectKindred({
      fatherAlive,
      motherAlive,
      siblings,
      predeceasedSiblings,
      nextOfKin,
    });
    if (kindred.length === 0) {
      notes.push("No heirs identified. Estate would escheat to the State.");
      return { title: "Christian intestate — no heirs", shares: [], notes };
    }
    // Section 42 — if father alive, he takes all
    if (fatherAlive && !motherAlive && siblings === 0 && predeceasedSiblings.length === 0 && nextOfKin === 0) {
      shares.push({ heir: "Father", fraction: 1, rule: "Section 42 — father takes all" });
      notes.push("Section 42: father alive → entire estate to father.");
    } else {
      const total = kindred.reduce((s, k) => s + k.fraction, 0) || 1;
      kindred.forEach((k) => shares.push({ ...k, fraction: k.fraction / total }));
      notes.push("Sections 43–48: kindred share the entire estate per the applicable rule.");
    }
  }

  return {
    title: "Christian intestate — computed shares",
    shares,
    notes,
  };
}

function distributeDescendants(pool, livingChildren, predeceasedChildren, shares) {
  const predeceasedGroups = predeceasedChildren.filter((c) => (c.descendants || 0) > 0);
  const stirps = livingChildren + predeceasedGroups.length;
  if (stirps === 0) return;
  const per = pool / stirps;
  for (let i = 0; i < livingChildren; i++) {
    shares.push({ heir: `Child ${i + 1}`, fraction: per, rule: "Sections 37–40 — equal share" });
  }
  predeceasedGroups.forEach((pc, idx) => {
    const n = pc.descendants;
    const perGrand = per / n;
    for (let k = 0; k < n; k++) {
      shares.push({
        heir: `Grandchild ${k + 1} of predeceased child ${idx + 1}`,
        fraction: perGrand,
        rule: "Section 40 — per stirpes",
      });
    }
  });
}

function collectKindred({ fatherAlive, motherAlive, siblings, predeceasedSiblings, nextOfKin }) {
  const kindred = [];
  // Section 43: mother + siblings (each group one share). Father would take all under §42.
  if (fatherAlive && !motherAlive && siblings === 0 && predeceasedSiblings.length === 0) {
    kindred.push({ heir: "Father", fraction: 1, rule: "Section 42" });
    return kindred;
  }
  if (fatherAlive) kindred.push({ heir: "Father", fraction: 1, rule: "Sections 42–43" });
  if (motherAlive) kindred.push({ heir: "Mother", fraction: 1, rule: "Sections 43–46" });
  for (let i = 0; i < siblings; i++)
    kindred.push({ heir: `Sibling ${i + 1}`, fraction: 1, rule: "Sections 43–47" });
  predeceasedSiblings.forEach((ps, idx) => {
    const n = ps.descendants || 0;
    if (n === 0) return;
    const per = 1 / n;
    for (let k = 0; k < n; k++) {
      kindred.push({
        heir: `Child ${k + 1} of predeceased sibling ${idx + 1}`,
        fraction: per,
        rule: "Sections 43–47 — per stirpes",
      });
    }
  });
  for (let i = 0; i < nextOfKin; i++) {
    kindred.push({ heir: `Next of kin ${i + 1}`, fraction: 1, rule: "Section 48 — nearest in degree" });
  }
  return kindred;
}

function applySection34(shares, opts) {
  shares.push({
    heir: "Widow/Widower",
    fraction: 0.5,
    rule: "Section 34 — half to spouse",
  });
  const kindred = collectKindred(opts);
  const total = kindred.reduce((s, k) => s + k.fraction, 0) || 1;
  kindred.forEach((k) =>
    shares.push({ ...k, fraction: (k.fraction / total) * 0.5 })
  );
}

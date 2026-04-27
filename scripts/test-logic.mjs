import { computeParsi } from "../src/logic/parsi.js";
import { computeChristian } from "../src/logic/christian.js";

let pass = 0;
let fail = 0;

const approx = (a, b, eps = 1e-6) => Math.abs(a - b) < eps;

function findHeir(result, predicate) {
  return result.shares.find((s) =>
    typeof predicate === "string" ? s.heir === predicate : predicate(s),
  );
}

function totalAmount(result) {
  return result.shares.reduce((s, x) => s + (x.amount || 0), 0);
}

function test(name, fn) {
  try {
    fn();
    console.log(`[32m✓[0m ${name}`);
    pass++;
  } catch (e) {
    console.log(`[31m✗[0m ${name}`);
    console.log("  " + e.message);
    fail++;
  }
}

// ─────────────────────────────────────────────────────────────
// Parsi tests
// ─────────────────────────────────────────────────────────────

test("Parsi: spouse + 2 children → 4 equal shares of estate", () => {
  const r = computeParsi({
    house: 4_000_000,
    spouseAlive: true,
    totalChildren: 2,
  });
  if (r.shares.length !== 3)
    throw new Error(`expected 3 shares (spouse + 2 children), got ${r.shares.length}`);
  for (const s of r.shares) {
    if (!approx(s.amount, 4_000_000 / 3, 1e-3))
      throw new Error(`${s.heir}=${s.amount}, expected ${4_000_000 / 3}`);
  }
  if (!approx(totalAmount(r), 4_000_000, 1e-3))
    throw new Error(`total=${totalAmount(r)} expected 4,000,000`);
});

test("Parsi: spouse + 2 children + mother → mother gets half a child's unit", () => {
  const r = computeParsi({
    house: 3_500_000,
    spouseAlive: true,
    totalChildren: 2,
    motherAlive: true,
  });
  // units = 2 children + spouse + 0.5 mother = 3.5; unit = 1,000,000
  const spouse = findHeir(r, "Spouse");
  const mother = findHeir(r, "Mother");
  if (!approx(spouse.amount, 1_000_000, 1e-3))
    throw new Error(`spouse=${spouse.amount}`);
  if (!approx(mother.amount, 500_000, 1e-3))
    throw new Error(`mother=${mother.amount}`);
});

test("Parsi: predeceased son with widow + 2 grandchildren splits unit three ways", () => {
  const r = computeParsi({
    house: 3_000_000,
    spouseAlive: true,
    totalChildren: 2, // 1 living + 1 predeceased
    predeceasedChildren: [
      { type: "son", widow: true, branchCount: 2, predeceasedGrandchildren: [] },
    ],
  });
  // units = 1 living + 1 predeceased + spouse = 3; unit = 1,000,000
  // predeceased son's unit splits 3 ways (widow + 2 grandchildren) = 333,333.33
  const psWidow = findHeir(r, (h) => h.heir === "Widow (Branch 1)");
  if (!psWidow) throw new Error("missing predeceased-son widow");
  if (!approx(psWidow.amount, 1_000_000 / 3, 1e-2))
    throw new Error(`psWidow=${psWidow.amount}`);
});

test("Parsi: predeceased son, no descendants, only widow → widow gets unit/2 and s53Triggered", () => {
  const r = computeParsi({
    house: 2_000_000,
    spouseAlive: true,
    totalChildren: 1, // the predeceased one
    predeceasedChildren: [
      { type: "son", widow: true, branchCount: 0, predeceasedGrandchildren: [] },
    ],
  });
  // units = 1 (predeceased) + 1 (spouse) = 2; unit = 1,000,000
  const psWidow = findHeir(r, "Widow (Branch 1)");
  if (!approx(psWidow.amount, 500_000, 1e-3))
    throw new Error(`expected 500,000, got ${psWidow.amount}`);
  if (!r.s53Triggered) throw new Error("expected s53Triggered to be true");
});

test("Parsi: predeceased daughter with 2 children → her unit splits between her children only", () => {
  const r = computeParsi({
    house: 2_000_000,
    spouseAlive: false,
    totalChildren: 2, // 1 living + 1 predeceased daughter
    predeceasedChildren: [
      { type: "daughter", branchCount: 2, predeceasedGrandchildren: [] },
    ],
  });
  // units = 2; unit = 1,000,000; each grandchild gets 500,000
  const gc = r.shares.filter((h) => h.heir.startsWith("Grandchild"));
  if (gc.length !== 2) throw new Error(`expected 2 grandchildren, got ${gc.length}`);
  for (const g of gc)
    if (!approx(g.amount, 500_000, 1e-3))
      throw new Error(`${g.heir}=${g.amount}`);
});

test("Parsi: full will short-circuits, returns fullWill flag and zero shares", () => {
  const r = computeParsi({
    house: 1_000_000,
    spouseAlive: true,
    totalChildren: 1,
    willPresent: true,
  });
  if (!r.fullWill) throw new Error("expected fullWill=true");
  if (r.shares.length !== 0) throw new Error("expected 0 shares with full will");
  if (!approx(r.totalEstate, 1_000_000, 1e-3))
    throw new Error(`totalEstate=${r.totalEstate}`);
});

test("Parsi: partial will trims residue", () => {
  const r = computeParsi({
    house: 1_000_000,
    spouseAlive: true,
    totalChildren: 1,
    partialWill: true,
    willPercent: 50,
  });
  if (!approx(r.totalEstate, 500_000, 1e-3))
    throw new Error(`totalEstate=${r.totalEstate}, expected 500,000`);
  if (!approx(totalAmount(r), 500_000, 1e-3))
    throw new Error(`total=${totalAmount(r)}, expected 500,000`);
});

test("Parsi: nominee override pulls insurance and pension out of estate", () => {
  const r = computeParsi({
    house: 1_000_000,
    insurance: 200_000,
    pension: 100_000,
    insNominee: "Alice",
    penNominee: "Bob",
    nomineeOverride: true,
    spouseAlive: true,
    totalChildren: 1,
  });
  if (!approx(r.totalEstate, 1_000_000, 1e-3))
    throw new Error(`expected estate to exclude nominee assets, got ${r.totalEstate}`);
  if (r.nomineeHeirs.length !== 2)
    throw new Error(`expected 2 nominee heirs, got ${r.nomineeHeirs.length}`);
  const alice = r.nomineeHeirs.find((n) => n.heir === "Alice");
  if (!alice || !approx(alice.amount, 200_000, 1e-3))
    throw new Error(`Alice nominee amount wrong`);
});

test("Parsi: no children, spouse + both parents → spouse 1/2, parents share residue", () => {
  const r = computeParsi({
    house: 4_000_000,
    spouseAlive: true,
    totalChildren: 0,
    fatherAlive: true,
    motherAlive: true,
  });
  const spouse = findHeir(r, "Spouse");
  const father = findHeir(r, "Father");
  const mother = findHeir(r, "Mother");
  if (!approx(spouse.amount, 2_000_000, 1e-3))
    throw new Error(`spouse=${spouse.amount}, expected 2,000,000`);
  if (!approx(father.amount, 1_000_000, 1e-3))
    throw new Error(`father=${father.amount}, expected 1,000,000`);
  if (!approx(mother.amount, 1_000_000, 1e-3))
    throw new Error(`mother=${mother.amount}, expected 1,000,000`);
});

test("Parsi: no children, spouse + 1 parent + 2 siblings → spouse 1/2, residue split 3 ways", () => {
  const r = computeParsi({
    house: 6_000_000,
    spouseAlive: true,
    totalChildren: 0,
    motherAlive: true,
    siblings: 2,
  });
  const spouse = findHeir(r, "Spouse");
  const mother = findHeir(r, "Mother");
  const sib1 = findHeir(r, "Sibling 1");
  if (!approx(spouse.amount, 3_000_000, 1e-3))
    throw new Error(`spouse=${spouse.amount}`);
  if (!approx(mother.amount, 1_000_000, 1e-3))
    throw new Error(`mother=${mother.amount}`);
  if (!approx(sib1.amount, 1_000_000, 1e-3))
    throw new Error(`sib1=${sib1.amount}`);
});

test("Parsi: no children, no spouse, only siblings (1 living + 1 predeceased w/ 2 kids)", () => {
  const r = computeParsi({
    house: 2_000_000,
    spouseAlive: false,
    totalChildren: 0,
    siblings: 2,
    predeceasedSiblings: [{ branchCount: 2 }],
  });
  // 2 slots → each gets 1,000,000; predeceased sibling's branch splits → 500k each
  const sib = findHeir(r, "Sibling 1");
  if (!approx(sib.amount, 1_000_000, 1e-3))
    throw new Error(`sib=${sib.amount}`);
  const nephews = r.shares.filter((h) =>
    h.heir.startsWith("Child") && h.heir.includes("predeceased sibling"),
  );
  if (nephews.length !== 2)
    throw new Error(`expected 2 nephews, got ${nephews.length}`);
  for (const n of nephews)
    if (!approx(n.amount, 500_000, 1e-3))
      throw new Error(`${n.heir}=${n.amount}`);
});

test("Parsi: no children, spouse only, no kin → spouse takes all", () => {
  const r = computeParsi({
    house: 1_500_000,
    spouseAlive: true,
    totalChildren: 0,
  });
  if (r.shares.length !== 1) throw new Error(`expected 1 share`);
  if (!approx(r.shares[0].amount, 1_500_000, 1e-3))
    throw new Error(`spouse=${r.shares[0].amount}`);
});

test("Parsi: no children, no spouse, no kin → empty shares + escheat note", () => {
  const r = computeParsi({
    house: 1_000_000,
    spouseAlive: false,
    totalChildren: 0,
  });
  if (r.shares.length !== 0)
    throw new Error(`expected 0 shares, got ${r.shares.length}`);
  if (!r.notes.some((n) => n.toLowerCase().includes("escheat")))
    throw new Error("expected escheat note");
});

test("Parsi: gift reduces estate", () => {
  const r = computeParsi({
    house: 1_000_000,
    gift: 200_000,
    spouseAlive: true,
    totalChildren: 1,
  });
  if (!approx(r.totalEstate, 800_000, 1e-3))
    throw new Error(`totalEstate=${r.totalEstate}, expected 800,000`);
});

// ─────────────────────────────────────────────────────────────
// Christian tests
// ─────────────────────────────────────────────────────────────

test("Christian: spouse + 3 children → spouse 1/3, each child 2/9", () => {
  const r = computeChristian({
    house: 9_000_000,
    spouseAlive: true,
    totalChildren: 3,
  });
  const spouse = findHeir(r, "Spouse");
  if (!approx(spouse.amount, 3_000_000, 1e-3))
    throw new Error(`spouse=${spouse.amount}`);
  const child = findHeir(r, "Child 1");
  if (!approx(child.amount, 2_000_000, 1e-3))
    throw new Error(`child=${child.amount}`);
});

test("Christian: spouse + 1 living child + 1 predeceased child with 2 grandchildren", () => {
  const r = computeChristian({
    house: 9_000_000,
    spouseAlive: true,
    totalChildren: 2,
    predeceasedChildren: [{ branchCount: 2 }],
  });
  // spouse 3M, rest 6M / 2 stirpes = 3M each, grandchildren split 3M / 2 = 1.5M each
  const child = findHeir(r, "Child 1");
  const gc = r.shares.filter((h) => h.heir.startsWith("Grandchild"));
  if (!approx(child.amount, 3_000_000, 1e-3))
    throw new Error(`child=${child.amount}`);
  if (gc.length !== 2)
    throw new Error(`expected 2 grandchildren, got ${gc.length}`);
  for (const g of gc)
    if (!approx(g.amount, 1_500_000, 1e-3))
      throw new Error(`${g.heir}=${g.amount}`);
});

test("Christian: no spouse, 2 children → 50/50", () => {
  const r = computeChristian({
    house: 1_000_000,
    spouseAlive: false,
    totalChildren: 2,
  });
  if (r.shares.length !== 2)
    throw new Error(`expected 2 shares, got ${r.shares.length}`);
  for (const s of r.shares)
    if (!approx(s.amount, 500_000, 1e-3))
      throw new Error(`${s.heir}=${s.amount}`);
});

test("Christian: no descendants, spouse + mother → spouse 1/2, mother 1/2", () => {
  const r = computeChristian({
    house: 2_000_000,
    spouseAlive: true,
    totalChildren: 0,
    motherAlive: true,
  });
  const spouse = findHeir(r, "Spouse");
  const mother = findHeir(r, "Mother");
  if (!approx(spouse.amount, 1_000_000, 1e-3))
    throw new Error(`spouse=${spouse.amount}`);
  if (!approx(mother.amount, 1_000_000, 1e-3))
    throw new Error(`mother=${mother.amount}`);
});

test("Christian: no descendants, spouse only → spouse takes all", () => {
  const r = computeChristian({
    house: 1_000_000,
    spouseAlive: true,
    totalChildren: 0,
  });
  if (r.shares.length !== 1) throw new Error(`expected 1 share`);
  if (!approx(r.shares[0].amount, 1_000_000, 1e-3))
    throw new Error(`spouse=${r.shares[0].amount}`);
});

test("Christian: no spouse / descendants, only father → father takes all", () => {
  const r = computeChristian({
    house: 800_000,
    spouseAlive: false,
    totalChildren: 0,
    fatherAlive: true,
  });
  if (r.shares.length !== 1 || r.shares[0].heir !== "Father")
    throw new Error(`expected Father only`);
  if (!approx(r.shares[0].amount, 800_000, 1e-3))
    throw new Error(`father=${r.shares[0].amount}`);
});

test("Christian: no spouse / descendants / parents, 2 siblings → 50/50", () => {
  const r = computeChristian({
    house: 1_000_000,
    spouseAlive: false,
    totalChildren: 0,
    siblings: 2,
  });
  if (r.shares.length !== 2) throw new Error(`expected 2 siblings`);
  for (const s of r.shares)
    if (!approx(s.amount, 500_000, 1e-3))
      throw new Error(`${s.heir}=${s.amount}`);
});

test("Christian: no kindred at all → goes to further kindred bucket", () => {
  const r = computeChristian({
    house: 100_000,
    spouseAlive: false,
    totalChildren: 0,
  });
  if (r.shares.length !== 1)
    throw new Error(`expected 1 further-kindred share`);
  if (!r.shares[0].heir.startsWith("Further kindred"))
    throw new Error(`expected further-kindred bucket, got ${r.shares[0].heir}`);
});

test("Christian: full will short-circuits", () => {
  const r = computeChristian({
    house: 1_000_000,
    spouseAlive: true,
    totalChildren: 1,
    willPresent: true,
  });
  if (!r.fullWill) throw new Error("expected fullWill=true");
  if (r.shares.length !== 0) throw new Error("expected 0 shares");
});

test("Christian: partial will trims residue then runs Section 33", () => {
  const r = computeChristian({
    house: 1_500_000,
    spouseAlive: true,
    totalChildren: 1,
    partialWill: true,
    willPercent: 40,
  });
  // residue = 900,000; spouse = 300,000; child = 600,000
  if (!approx(r.totalEstate, 900_000, 1e-3))
    throw new Error(`totalEstate=${r.totalEstate}`);
  const spouse = findHeir(r, "Spouse");
  if (!approx(spouse.amount, 300_000, 1e-3))
    throw new Error(`spouse=${spouse.amount}`);
});

test("Christian: nominee override diverts insurance/pension", () => {
  const r = computeChristian({
    bank: 500_000,
    insurance: 200_000,
    pension: 100_000,
    nomineeOverride: true,
    spouseAlive: true,
    totalChildren: 0,
  });
  if (!approx(r.totalEstate, 500_000, 1e-3))
    throw new Error(`totalEstate=${r.totalEstate}`);
  if (r.nomineeHeirs.length !== 2)
    throw new Error(`expected 2 nominees, got ${r.nomineeHeirs.length}`);
});

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);

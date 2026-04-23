import { computeParsi } from "../src/logic/parsi.js";
import { computeChristian } from "../src/logic/christian.js";

let pass = 0;
let fail = 0;

const approx = (a, b, eps = 1e-6) => Math.abs(a - b) < eps;

function summarise(result) {
  const total = result.shares.reduce((s, x) => s + x.fraction, 0);
  return result.shares.map((s) => ({
    heir: s.heir,
    pct: total > 0 ? +((s.fraction / total) * 100).toFixed(4) : 0,
  }));
}

function test(name, fn) {
  try {
    fn();
    console.log(`\u001b[32m✓\u001b[0m ${name}`);
    pass++;
  } catch (e) {
    console.log(`\u001b[31m✗\u001b[0m ${name}`);
    console.log("  " + e.message);
    fail++;
  }
}

// ─────────────────────────────────────────────────────────────
// Parsi tests
// ─────────────────────────────────────────────────────────────

test("Parsi: widow + 2 sons + 1 daughter → 4 equal shares", () => {
  const r = computeParsi({
    spouseAlive: true, livingSons: 2, livingDaughters: 1,
  });
  const s = summarise(r);
  if (s.length !== 4) throw new Error(`expected 4 shares, got ${s.length}`);
  for (const x of s) if (!approx(x.pct, 25)) throw new Error(`${x.heir} = ${x.pct}, expected 25`);
});

test("Parsi: widow + 2 sons + mother → widow/sons 28.57%, mother 14.29%", () => {
  const r = computeParsi({
    spouseAlive: true, livingSons: 2, motherAlive: true,
  });
  const s = summarise(r);
  const widow = s.find((x) => x.heir === "Widow");
  const mother = s.find((x) => x.heir === "Mother");
  if (!approx(widow.pct, 100 / 3.5, 1e-2))
    throw new Error(`widow pct = ${widow.pct}, expected ${100 / 3.5}`);
  if (!approx(mother.pct, 50 / 3.5, 1e-2))
    throw new Error(`mother pct = ${mother.pct}, expected ${50 / 3.5}`);
});

test("Parsi: predeceased son with widow + 2 children → his share split 3 ways", () => {
  const r = computeParsi({
    spouseAlive: true, livingSons: 1,
    predeceasedSons: [{ widow: true, descendants: 2 }],
  });
  const s = summarise(r);
  // shares: widow(1), son(1), ps_widow(1/3), ps_child1(1/3), ps_child2(1/3) = total 3
  const widow = s.find((x) => x.heir === "Widow");
  if (!approx(widow.pct, 100 / 3, 1e-2)) throw new Error(`widow pct ${widow.pct}`);
  const psWidow = s.find((x) => x.heir.includes("Widow of predeceased"));
  if (!approx(psWidow.pct, (1 / 3) * 100 / 3, 1e-2))
    throw new Error(`predeceased son's widow pct ${psWidow.pct}`);
});

test("Parsi: predeceased daughter with 2 children → share split equally between them only", () => {
  const r = computeParsi({
    spouseAlive: false, livingSons: 1,
    predeceasedDaughters: [{ descendants: 2 }],
  });
  const s = summarise(r);
  // shares: son(1), child1(0.5), child2(0.5) = total 2 → son 50%, each child 25%
  const son = s.find((x) => x.heir === "Son 1");
  if (!approx(son.pct, 50, 1e-2)) throw new Error(`son pct ${son.pct}`);
});

test("Parsi: no lineal descendants, widow only → widow takes all", () => {
  const r = computeParsi({ spouseAlive: true });
  const s = summarise(r);
  if (s.length !== 1) throw new Error(`expected 1 share, got ${s.length}`);
  if (!approx(s[0].pct, 100)) throw new Error(`widow pct ${s[0].pct}`);
});

test("Parsi: no lineal descendants, widow + 2 siblings → widow 50%, siblings 25% each", () => {
  const r = computeParsi({ spouseAlive: true, siblings: 2 });
  const s = summarise(r);
  const widow = s.find((x) => x.heir === "Widow");
  if (!approx(widow.pct, 50, 1e-2)) throw new Error(`widow pct ${widow.pct}`);
  const sib = s.filter((x) => x.heir.startsWith("Sibling"));
  for (const x of sib)
    if (!approx(x.pct, 25, 1e-2)) throw new Error(`${x.heir} = ${x.pct}`);
});

test("Parsi: female intestate → labels use 'Widower'", () => {
  const r = computeParsi({ deceasedSex: "female", spouseAlive: true, livingSons: 1 });
  const names = r.shares.map((s) => s.heir).join(",");
  if (!names.includes("Widower")) throw new Error(`expected Widower in ${names}`);
});

test("Parsi: no heirs at all → empty shares with escheat note", () => {
  const r = computeParsi({});
  if (r.shares.length !== 0) throw new Error(`expected 0 shares, got ${r.shares.length}`);
  if (!r.notes.some((n) => n.toLowerCase().includes("escheat")))
    throw new Error(`expected escheat note`);
});

// ─────────────────────────────────────────────────────────────
// Christian tests
// ─────────────────────────────────────────────────────────────

test("Christian: widow + 3 children → widow 33.33%, each child 22.22%", () => {
  const r = computeChristian({ spouseAlive: true, livingChildren: 3 });
  const s = summarise(r);
  const widow = s.find((x) => x.heir.includes("Widow"));
  if (!approx(widow.pct, 100 / 3, 1e-2)) throw new Error(`widow pct ${widow.pct}`);
  const child = s.find((x) => x.heir === "Child 1");
  if (!approx(child.pct, 200 / 9, 1e-2)) throw new Error(`child pct ${child.pct}`);
});

test("Christian: widow + 1 son + 2 grandchildren (predeceased daughter) → 33.33 / 33.33 / 16.67 / 16.67", () => {
  const r = computeChristian({
    spouseAlive: true, livingChildren: 1,
    predeceasedChildren: [{ descendants: 2 }],
  });
  const s = summarise(r);
  const widow = s.find((x) => x.heir.includes("Widow"));
  const son = s.find((x) => x.heir === "Child 1");
  const gc = s.find((x) => x.heir.includes("Grandchild 1"));
  if (!approx(widow.pct, 100 / 3, 1e-2)) throw new Error(`widow ${widow.pct}`);
  if (!approx(son.pct, 100 / 3, 1e-2)) throw new Error(`son ${son.pct}`);
  if (!approx(gc.pct, 100 / 6, 1e-2)) throw new Error(`grandchild ${gc.pct}`);
});

test("Christian: no spouse, only 2 children → 50/50", () => {
  const r = computeChristian({ spouseAlive: false, livingChildren: 2 });
  const s = summarise(r);
  if (s.length !== 2) throw new Error(`expected 2 shares, got ${s.length}`);
  for (const x of s) if (!approx(x.pct, 50)) throw new Error(`${x.heir} = ${x.pct}`);
});

test("Christian: widow + kindred (no descendants, not Indian Christian) → Section 34 half/half", () => {
  const r = computeChristian({
    spouseAlive: true,
    isIndianChristian: false,
    livingChildren: 0,
    motherAlive: true,
    siblings: 2,
  });
  const s = summarise(r);
  const widow = s.find((x) => x.heir.includes("Widow"));
  if (!approx(widow.pct, 50, 1e-2)) throw new Error(`widow pct ${widow.pct}`);
  // mother + 2 siblings share 50% equally
  const mother = s.find((x) => x.heir === "Mother");
  if (!approx(mother.pct, 50 / 3, 1e-2)) throw new Error(`mother pct ${mother.pct}`);
});

test("Christian: Section 33A — estate ₹10 lakh, Indian Christian, widow + father", () => {
  const estate = 1_000_000;
  const r = computeChristian({
    estate, isIndianChristian: true,
    spouseAlive: true, livingChildren: 0,
    fatherAlive: true,
  });
  const s = r.shares;
  const widowFrac = s.find((x) => x.heir.includes("Widow")).fraction;
  const expectedWidowAmount = 5000 + (estate - 5000) / 2;
  const widowAmount = (widowFrac / s.reduce((a, x) => a + x.fraction, 0)) * estate;
  if (!approx(widowAmount, expectedWidowAmount, 1))
    throw new Error(`widow amount ${widowAmount} vs ${expectedWidowAmount}`);
});

test("Christian: Section 33A — tiny estate ₹3,000 → widow takes all", () => {
  const r = computeChristian({
    estate: 3000, isIndianChristian: true,
    spouseAlive: true, livingChildren: 0, fatherAlive: true,
  });
  const s = summarise(r);
  if (s.length !== 1) throw new Error(`expected widow only, got ${s.length} shares`);
  if (!approx(s[0].pct, 100, 1e-2)) throw new Error(`widow ${s[0].pct}`);
});

test("Christian: no widow, no descendants, father alive only → father takes all (§42)", () => {
  const r = computeChristian({ spouseAlive: false, livingChildren: 0, fatherAlive: true });
  const s = summarise(r);
  if (s.length !== 1 || s[0].heir !== "Father")
    throw new Error(`expected Father only, got ${JSON.stringify(s)}`);
  if (!approx(s[0].pct, 100)) throw new Error(`father pct ${s[0].pct}`);
});

test("Christian: no heirs → escheat note, empty shares", () => {
  const r = computeChristian({});
  if (r.shares.length !== 0) throw new Error(`expected 0 shares`);
  if (!r.notes.some((n) => n.toLowerCase().includes("escheat")))
    throw new Error(`expected escheat note`);
});

test("Christian: widow alone (no descendants, no kindred, not Indian) → widow normalised to 100%", () => {
  const r = computeChristian({ spouseAlive: true, isIndianChristian: false, livingChildren: 0 });
  const s = summarise(r);
  const widow = s.find((x) => x.heir.includes("Widow"));
  if (!approx(widow.pct, 100, 1e-2)) throw new Error(`widow pct ${widow.pct}`);
});

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);

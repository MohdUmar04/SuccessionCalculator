/*
 * Christian Intestate Succession — direct port of the engine in
 * docs/legacy/christian.htm.
 *
 * Estate is built from house + bank + insurance + pension - lifetime gifts,
 * with insurance / pension optionally diverted to nominees. A full will
 * short-circuits the calculation; a partial will trims the residue.
 *
 * With descendants:
 *   spouse alive → Section 33: 1/3 to spouse, 2/3 split equally per stirpes
 *                  among children (and grandchildren of predeceased children).
 *   no spouse    → entire estate split equally per stirpes among descendants.
 *
 * No descendants:
 *   spouse + parent(s) → Section 34: 1/2 to spouse, parents share the half.
 *   spouse, no parents → spouse takes everything.
 *   no spouse, parent(s) → parents share the estate.
 *   no spouse / parents, siblings → siblings (and nephews/nieces of predeceased
 *                                    siblings) share equally per stirpes.
 *   nothing of the above → goes to "further kindred" under §§41–49.
 */

export function computeChristian(input) {
  const {
    house = 0,
    bank = 0,
    insurance = 0,
    pension = 0,
    gift = 0,
    insNominee = "",
    penNominee = "",
    nomineeOverride = false,
    spouseAlive = false,
    willPresent = false,
    partialWill = false,
    willPercent = 0,
    totalChildren = 0,
    predeceasedChildren = [],
    fatherAlive = false,
    motherAlive = false,
    siblings = 0,
    predeceasedSiblings = [],
  } = input;

  const result = {
    title: "Christian intestate — distribution",
    grossEstate: 0,
    totalEstate: 0,
    shares: [],
    notes: [],
    nomineeHeirs: [],
    fullWill: false,
  };

  let estateInsurance = insurance;
  let estatePension = pension;

  if (nomineeOverride) {
    if (insurance > 0) {
      result.nomineeHeirs.push({
        heir: (insNominee || "").trim() || "Insurance Nominee",
        amount: insurance,
        rule: "Nominee — outside estate",
      });
      estateInsurance = 0;
    }
    if (pension > 0) {
      result.nomineeHeirs.push({
        heir: (penNominee || "").trim() || "Pension Nominee",
        amount: pension,
        rule: "Nominee — outside estate",
      });
      estatePension = 0;
    }
  }

  let totalEstate = house + bank + estateInsurance + estatePension - gift;
  if (totalEstate < 0) totalEstate = 0;
  result.grossEstate = totalEstate;

  if (willPresent) {
    result.fullWill = true;
    result.totalEstate = totalEstate;
    return result;
  }

  if (partialWill && willPercent > 0) {
    totalEstate = totalEstate * (1 - willPercent / 100);
    if (totalEstate < 0) totalEstate = 0;
    result.notes.push(
      `Partial will applied: ${willPercent}% of the estate is governed by the will; the remainder is distributed below.`,
    );
  }

  result.totalEstate = totalEstate;
  if (totalEstate <= 0) return result;

  const preChildren = predeceasedChildren.length;
  const aliveChildren = Math.max(0, totalChildren - preChildren);

  // CASE 1: with descendants
  if (totalChildren > 0) {
    if (spouseAlive) {
      const spouseShare = totalEstate / 3;
      const rest = totalEstate - spouseShare;
      result.shares.push({
        heir: "Spouse",
        amount: spouseShare,
        rule: "Section 33 — one-third to spouse",
      });
      const units = aliveChildren + preChildren;
      if (units > 0) {
        const unit = rest / units;
        for (let i = 1; i <= aliveChildren; i++) {
          result.shares.push({
            heir: `Child ${i}`,
            amount: unit,
            rule: "Section 33 — equal share of two-thirds",
          });
        }
        predeceasedChildren.forEach((pc, i) => {
          const count = Number(pc.branchCount) || 0;
          if (count === 0) return;
          const perHead = unit / count;
          for (let j = 1; j <= count; j++) {
            result.shares.push({
              heir: `Grandchild (Branch ${i + 1})`,
              amount: perHead,
              rule: "Sections 36–40 — per stirpes",
            });
          }
        });
      }
      result.notes.push(
        "Section 33 applied: spouse takes one-third; lineal descendants share two-thirds.",
      );
    } else {
      const units = aliveChildren + preChildren;
      if (units > 0) {
        const unit = totalEstate / units;
        for (let i = 1; i <= aliveChildren; i++) {
          result.shares.push({
            heir: `Child ${i}`,
            amount: unit,
            rule: "Sections 36–40 — equal share",
          });
        }
        predeceasedChildren.forEach((pc, i) => {
          const count = Number(pc.branchCount) || 0;
          if (count === 0) return;
          const perHead = unit / count;
          for (let j = 1; j <= count; j++) {
            result.shares.push({
              heir: `Grandchild (Branch ${i + 1})`,
              amount: perHead,
              rule: "Sections 36–40 — per stirpes",
            });
          }
        });
      }
      result.notes.push(
        "No spouse: descendants take the entire estate per stirpes.",
      );
    }
    return result;
  }

  // CASE 2: no descendants
  if (spouseAlive) {
    if (fatherAlive || motherAlive) {
      const spouseShare = totalEstate / 2;
      result.shares.push({
        heir: "Spouse",
        amount: spouseShare,
        rule: "Section 34 — one-half to spouse",
      });
      const parents = [];
      if (fatherAlive) parents.push("Father");
      if (motherAlive) parents.push("Mother");
      const perHead = (totalEstate - spouseShare) / parents.length;
      parents.forEach((p) =>
        result.shares.push({
          heir: p,
          amount: perHead,
          rule: "Section 34 — kindred share the other half",
        }),
      );
      result.notes.push(
        "Section 34: spouse takes half; surviving parent(s) share the other half.",
      );
    } else {
      result.shares.push({
        heir: "Spouse",
        amount: totalEstate,
        rule: "No descendants or kindred — spouse takes all",
      });
      result.notes.push(
        "No descendants or kindred — the entire estate goes to the spouse.",
      );
    }
    return result;
  }

  // No spouse, no descendants
  if (fatherAlive || motherAlive) {
    const parents = [];
    if (fatherAlive) parents.push("Father");
    if (motherAlive) parents.push("Mother");
    const perHead = totalEstate / parents.length;
    parents.forEach((p) =>
      result.shares.push({
        heir: p,
        amount: perHead,
        rule: "Sections 42–43 — parents take the estate",
      }),
    );
    result.notes.push(
      "Sections 42–43: parents take the estate when no spouse or descendants.",
    );
    return result;
  }

  if (siblings > 0) {
    const preSiblings = predeceasedSiblings.length;
    const aliveSiblings = Math.max(0, siblings - preSiblings);
    const totalUnits = aliveSiblings + preSiblings;
    if (totalUnits === 0) return result;
    const unit = totalEstate / totalUnits;
    for (let i = 1; i <= aliveSiblings; i++) {
      result.shares.push({
        heir: `Sibling ${i}`,
        amount: unit,
        rule: "Sections 44–47 — equal share",
      });
    }
    predeceasedSiblings.forEach((ps, i) => {
      const count = Number(ps.branchCount) || 0;
      if (count === 0) return;
      const perHead = unit / count;
      for (let j = 1; j <= count; j++) {
        result.shares.push({
          heir: `Nephew/Niece (Branch ${i + 1})`,
          amount: perHead,
          rule: "Sections 44–47 — per stirpes",
        });
      }
    });
    result.notes.push(
      "Sections 44–47: siblings (and nephews/nieces of predeceased siblings) share equally per stirpes.",
    );
    return result;
  }

  result.shares.push({
    heir: "Further kindred (uncles, aunts, cousins, etc.)",
    amount: totalEstate,
    rule: "Sections 41–49 — degree of kindred",
  });
  result.notes.push(
    "Distribution governed by Sections 41–49 (degree of kindred).",
  );

  return result;
}

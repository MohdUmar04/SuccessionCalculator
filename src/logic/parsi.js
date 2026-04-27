/*
 * Parsi Intestate Succession — direct port of the engine in
 * docs/legacy/parsi.htm, with the Section 54 + Schedule II branch added for
 * the no-lineal-descendants case (which the original .htm left unhandled).
 *
 * The engine works in rupee amounts (not normalised fractions). The estate is
 * assembled from house + bank + insurance + pension - lifetime gifts; insurance
 * and pension can be diverted to nominees. A full will short-circuits the
 * calculation; a partial will trims the residue. With descendants, the shares
 * follow Section 51 (spouse + each child = 1 unit, each parent = 0.5 unit).
 * Predeceased son / daughter shares are split per Section 53 with support for
 * predeceased grandchildren that pass their share to great-grandchildren.
 */

export function computeParsi(input) {
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
    title: "Parsi intestate — distribution",
    grossEstate: 0,
    totalEstate: 0,
    shares: [],
    notes: [],
    nomineeHeirs: [],
    fullWill: false,
    s53Triggered: false,
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
    totalEstate = totalEstate - (willPercent / 100) * totalEstate;
    if (totalEstate < 0) totalEstate = 0;
    result.notes.push(
      `Partial will applied: ${willPercent}% of the estate is governed by the will; the remainder is distributed below.`,
    );
  }

  result.totalEstate = totalEstate;
  if (totalEstate <= 0) return result;

  const preChildren = predeceasedChildren.length;
  const aliveChildren = Math.max(0, totalChildren - preChildren);

  if (totalChildren <= 0) {
    distributeNoDescendants(result, totalEstate, {
      spouseAlive,
      fatherAlive,
      motherAlive,
      siblings,
      predeceasedSiblings,
    });
    return result;
  }

  const parentCount = (fatherAlive ? 1 : 0) + (motherAlive ? 1 : 0);
  const units =
    aliveChildren + preChildren + (spouseAlive ? 1 : 0) + parentCount * 0.5;
  if (units === 0) return result;
  const unit = totalEstate / units;

  if (spouseAlive) {
    result.shares.push({
      heir: "Spouse",
      amount: unit,
      rule: "Section 51 — equal share",
    });
  }
  for (let i = 1; i <= aliveChildren; i++) {
    result.shares.push({
      heir: `Child ${i}`,
      amount: unit,
      rule: "Section 51 — equal share",
    });
  }
  if (fatherAlive) {
    result.shares.push({
      heir: "Father",
      amount: unit / 2,
      rule: "Section 51(2) — half of a child's share",
    });
  }
  if (motherAlive) {
    result.shares.push({
      heir: "Mother",
      amount: unit / 2,
      rule: "Section 51(2) — half of a child's share",
    });
  }

  let redistributionPool = 0;

  predeceasedChildren.forEach((pc, i) => {
    const idx = i + 1;
    const type = pc.type === "daughter" ? "daughter" : "son";
    const branchCount = Number(pc.branchCount) || 0;
    const widow = !!pc.widow;
    const preGCList = Array.isArray(pc.predeceasedGrandchildren)
      ? pc.predeceasedGrandchildren
      : [];
    const preGC = preGCList.length;

    let hasDesc = branchCount > 0;
    if (!hasDesc) {
      for (let j = 0; j < preGC; j++) {
        if ((Number(preGCList[j]?.count) || 0) > 0) {
          hasDesc = true;
          break;
        }
      }
    }

    if (type === "son") {
      if (!hasDesc && widow) {
        result.shares.push({
          heir: `Widow (Branch ${idx})`,
          amount: unit / 2,
          rule: "Section 53 — half to widow (no descendants)",
        });
        result.s53Triggered = true;
        return;
      }
      if (branchCount === 0 && widow) {
        result.shares.push({
          heir: `Widow (Branch ${idx})`,
          amount: unit,
          rule: "Section 53(a)",
        });
        redistributionPool += unit;
        return;
      }
      const members = branchCount + (widow ? 1 : 0);
      if (members === 0) return;
      const perHead = unit / members;
      if (widow) {
        result.shares.push({
          heir: `Widow (Branch ${idx})`,
          amount: perHead,
          rule: "Section 53(a) — equal with grandchildren",
        });
      }
      for (let j = 1; j <= branchCount; j++) {
        if (j <= preGC) {
          const gcount = Number(preGCList[j - 1]?.count) || 0;
          if (gcount === 0) continue;
          const subShare = perHead / gcount;
          for (let k = 1; k <= gcount; k++) {
            result.shares.push({
              heir: `Great-Grandchild (Branch ${idx}.${j})`,
              amount: subShare,
              rule: "Section 53(a) — per stirpes",
            });
          }
        } else {
          result.shares.push({
            heir: `Grandchild (Branch ${idx})`,
            amount: perHead,
            rule: "Section 53(a)",
          });
        }
      }
    } else {
      if (branchCount === 0) return;
      const perHead = unit / branchCount;
      for (let j = 1; j <= branchCount; j++) {
        if (j <= preGC) {
          const gcount = Number(preGCList[j - 1]?.count) || 0;
          if (gcount === 0) continue;
          const subShare = perHead / gcount;
          for (let k = 1; k <= gcount; k++) {
            result.shares.push({
              heir: `Great-Grandchild (Branch ${idx}.${j})`,
              amount: subShare,
              rule: "Section 53(b) — per stirpes",
            });
          }
        } else {
          result.shares.push({
            heir: `Grandchild (Branch ${idx})`,
            amount: perHead,
            rule: "Section 53(b) — equally among her children",
          });
        }
      }
    }
  });

  if (redistributionPool > 0) {
    const eligible = result.shares.filter(
      (h) => !h.heir.startsWith("Widow (Branch"),
    );
    if (eligible.length > 0) {
      const extra = redistributionPool / eligible.length;
      eligible.forEach((h) => {
        h.amount += extra;
      });
    }
  }

  result.notes.push(
    "Section 51: spouse and each child take equal shares; each parent takes half a child's share.",
  );
  if (preChildren > 0) {
    result.notes.push(
      "Predeceased children handled per Section 53 (per stirpes through grandchildren).",
    );
  }

  return result;
}

function distributeNoDescendants(result, totalEstate, opts) {
  const {
    spouseAlive,
    fatherAlive,
    motherAlive,
    siblings,
    predeceasedSiblings,
  } = opts;

  const preSibCount = predeceasedSiblings.length;
  const aliveSiblings = Math.max(0, siblings - preSibCount);

  const slots = [];
  if (fatherAlive) {
    slots.push({ kind: "fixed", heir: "Father", rule: "Schedule II — Part I" });
  }
  if (motherAlive) {
    slots.push({ kind: "fixed", heir: "Mother", rule: "Schedule II — Part I" });
  }
  for (let i = 1; i <= aliveSiblings; i++) {
    slots.push({
      kind: "fixed",
      heir: `Sibling ${i}`,
      rule: "Schedule II — full sibling",
    });
  }
  predeceasedSiblings.forEach((ps, idx) => {
    const count = Number(ps.branchCount) || 0;
    if (count > 0) {
      slots.push({
        kind: "branch",
        idx,
        count,
        rule: "Schedule II — per stirpes",
      });
    }
  });

  if (slots.length === 0) {
    if (spouseAlive) {
      result.shares.push({
        heir: "Spouse",
        amount: totalEstate,
        rule: "Section 54 — no Schedule II kin, spouse takes all",
      });
      result.notes.push(
        "No descendants and no Schedule II next of kin — spouse takes the entire estate.",
      );
    } else {
      result.notes.push(
        "No descendants, no spouse and no Schedule II kin. Property would escheat to the State.",
      );
    }
    return;
  }

  const spouseShare = spouseAlive ? totalEstate / 2 : 0;
  if (spouseAlive) {
    result.shares.push({
      heir: "Spouse",
      amount: spouseShare,
      rule: "Section 54(a) — one-half to spouse",
    });
  }

  const residue = totalEstate - spouseShare;
  const perSlot = residue / slots.length;

  slots.forEach((slot) => {
    if (slot.kind === "fixed") {
      result.shares.push({
        heir: slot.heir,
        amount: perSlot,
        rule: slot.rule,
      });
    } else {
      const per = perSlot / slot.count;
      for (let j = 1; j <= slot.count; j++) {
        result.shares.push({
          heir: `Child ${j} of predeceased sibling ${slot.idx + 1}`,
          amount: per,
          rule: slot.rule,
        });
      }
    }
  });

  result.notes.push(
    spouseAlive
      ? "Section 54: spouse takes one-half; residue divided equally among Schedule II next of kin (per stirpes for predeceased siblings)."
      : "No descendants or spouse: estate divided equally among Schedule II next of kin (per stirpes for predeceased siblings).",
  );
}

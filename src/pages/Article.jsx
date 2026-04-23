import { motion } from "framer-motion";
import { BookOpen, Scale, Users, Cross, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5 },
  }),
};

export default function Article() {
  return (
    <article className="max-w-3xl mx-auto space-y-10">
      <motion.header
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="space-y-4"
      >
        <div className="chip">
          <BookOpen className="w-3.5 h-3.5 text-accent-300" />
          Long read · Succession in India
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight leading-tight">
          How succession is actually calculated in India
        </h1>
        <p className="text-ink-300 text-lg">
          A practical, plain-English walk-through of how estates devolve under the Indian
          Succession Act, 1925 when there is no will — and what changes between the Parsi and
          Christian schemes.
        </p>
      </motion.header>

      <Section
        kicker="The big picture"
        title="One Act, many schemes"
        icon={Scale}
      >
        <p>
          India does not have a single uniform succession code. Testate succession — what happens
          when a person leaves a valid will — is broadly governed by the{" "}
          <strong>Indian Succession Act, 1925</strong>. But <em>intestate</em> succession — when a
          person dies <em>without</em> a will — splits along religious lines. Hindus, Buddhists,
          Jains and Sikhs are governed by the <strong>Hindu Succession Act, 1956</strong>; Muslims
          by their personal law; and <strong>Parsis</strong> and <strong>Christians</strong> by
          specific chapters of the 1925 Act.
        </p>
        <p>
          This article focuses on the two schemes the calculator models — Parsi (Sections 50–56)
          and Christian (Sections 31–49). Both aim to do the same thing: work out who gets what when
          a person dies owning property and leaves no instructions.
        </p>
      </Section>

      <Section kicker="Parsi succession" title="The 1991 reset" icon={Users}>
        <p>
          Until 1991, Parsi intestate succession still differentiated between sons and daughters —
          a son typically took twice what a daughter did. The{" "}
          <strong>Indian Succession (Amendment) Act, 1991</strong> overhauled Sections 50–56 to
          remove that distinction entirely. The guiding principles today:
        </p>
        <ol>
          <li>
            <strong>Equal share for spouse and every child.</strong> Under Section 51, the widow or
            widower, every son and every daughter each take <em>one equal share</em> of the estate.
            If there are a widow, two sons and a daughter alive, the estate divides into four equal
            shares.
          </li>
          <li>
            <strong>Each parent takes half a child's share.</strong> If either parent of the
            deceased survives them, that parent receives <em>half</em> of what a child receives. In
            the example above, adding a surviving mother changes the math to four full shares (for
            the spouse and three children) plus one half share (for the mother) — a total of 4.5
            units, with each child taking 1/4.5 and the mother 0.5/4.5.
          </li>
          <li>
            <strong>Predeceased descendants don't drop out — they get represented.</strong> Section
            53(a) says the share of a predeceased son goes to his widow and children as if he had
            died intestate at that moment. Section 53(b) is stricter: the share of a predeceased
            daughter goes <em>only</em> to her children, never to her widower.
          </li>
          <li>
            <strong>No lineal descendants?</strong> Section 54 kicks in. The spouse takes one-half;
            the remaining half devolves on relatives in the order laid down in Schedule II — parents
            first, then full siblings, then more remote kin.
          </li>
        </ol>

        <WorkedExample title="Worked example — Parsi male intestate">
          <p>
            Rustom dies intestate, leaving a widow, two sons, one daughter, and his mother (his
            father predeceased him). His estate is ₹1,20,00,000.
          </p>
          <ul>
            <li>Shares: 1 (widow) + 1 + 1 + 1 (three children) + 0.5 (mother) = <strong>4.5 units</strong></li>
            <li>Each child and the widow: 1/4.5 = <strong>22.22%</strong> ≈ ₹26,66,667 each</li>
            <li>Mother: 0.5/4.5 = <strong>11.11%</strong> ≈ ₹13,33,333</li>
          </ul>
        </WorkedExample>
      </Section>

      <Section kicker="Christian succession" title="Fixed fractions and a floor for widows" icon={Cross}>
        <p>
          The Christian scheme is older in feel — it uses fixed fractions rather than equal-share
          arithmetic. The two headline rules:
        </p>
        <ul>
          <li>
            <strong>Section 33 — spouse + descendants.</strong> The widow (or widower, via Section
            35) gets <em>one-third</em>. The remaining <em>two-thirds</em> goes to the lineal
            descendants, distributed per stirpes.
          </li>
          <li>
            <strong>Section 34 — spouse + kindred (no descendants).</strong> A straight{" "}
            <em>half and half</em>: spouse gets one-half, other relatives share the rest.
          </li>
        </ul>

        <p>
          <strong>Section 33A</strong> then carves out a special protection for the widow of an{" "}
          <em>Indian Christian</em> who dies intestate without lineal descendants. If the net estate
          is ₹5,000 or less, the widow takes <em>everything</em>. If it is more, she takes{" "}
          <em>₹5,000 plus half of the remainder</em>; the other half goes to kindred. The number is
          frozen in the 1925 drafting and is trivial today, but the mechanism still applies.
        </p>

        <p>
          Distribution among descendants follows Sections 36–40 on a <em>per stirpes</em> basis —
          the estate is divided into as many shares as there are branches (children plus groups of
          grandchildren from a predeceased child), and each branch divides its share internally.
          When there are no descendants, Sections 42–48 layer in father → mother + siblings →
          siblings and their children → remote kindred.
        </p>

        <WorkedExample title="Worked example — Christian intestate with children">
          <p>
            Thomas dies intestate leaving a widow, one living son, and two grandchildren from a
            predeceased daughter. His estate is ₹90,00,000.
          </p>
          <ul>
            <li>Widow (Section 33): 1/3 of ₹90,00,000 = <strong>₹30,00,000</strong></li>
            <li>
              Descendants (2/3 = ₹60,00,000) split per stirpes into two branches:
              <ul>
                <li>Living son: 1/2 of ₹60,00,000 = <strong>₹30,00,000</strong></li>
                <li>
                  Predeceased daughter's branch: 1/2 of ₹60,00,000 = ₹30,00,000, split equally
                  between her two children = <strong>₹15,00,000 each</strong>
                </li>
              </ul>
            </li>
          </ul>
        </WorkedExample>
      </Section>

      <Section kicker="How the calculator works" title="From rules to numbers">
        <p>
          The maths in both calculators is built on the same pattern. Each heir is assigned a{" "}
          <em>raw fraction</em> driven by the applicable section — 1 for a Parsi child, 0.5 for a
          Parsi parent, 1/3 for a Christian widow, and so on. These raw fractions are then{" "}
          <em>normalised</em>: the calculator sums them, then divides each by the total so the
          shares add up to 100 % of the estate. If you enter an estate value, that percentage is
          multiplied by the estate to produce rupee amounts.
        </p>
        <p>
          For predeceased descendants the logic is recursive — the deceased child's share is
          computed as if they had died intestate at that moment, then distributed among their own
          heirs. That's how Section 53 and Sections 37–40 generate a cascading tree of shares while
          still respecting the <em>per stirpes</em> principle.
        </p>
      </Section>

      <Section kicker="Caveats" title="Where this tool stops">
        <p>
          Succession questions are rarely arithmetic alone. In practice, a complete answer needs to
          check for a valid will; any testamentary trusts; the deceased's domicile; whether the
          property is self-acquired or joint; the religion of each heir (a conversion can change
          everything); whether any heir is disqualified; debts and liabilities; and any
          state-specific amendments. Nothing in this article or calculator should be read as legal
          advice.
        </p>
        <p>
          That said, once you clear those threshold questions, the arithmetic of intestate shares is
          precisely what the calculator models.
        </p>
      </Section>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-strong p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between"
      >
        <div>
          <h3 className="font-display text-xl font-semibold">Try a scenario</h3>
          <p className="text-ink-300 text-sm mt-1">Plug numbers into the calculators to see the rules in action.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/parsi" className="btn-primary">
            Parsi <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/christian" className="btn-ghost">
            Christian <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </article>
  );
}

function Section({ kicker, title, icon: Icon, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-accent-500/15 border border-accent-500/20 grid place-items-center">
            <Icon className="w-5 h-5 text-accent-300" />
          </div>
        )}
        <div>
          {kicker && (
            <div className="text-xs uppercase tracking-[0.2em] text-accent-300">{kicker}</div>
          )}
          <h2 className="font-display text-2xl md:text-3xl font-bold">{title}</h2>
        </div>
      </div>
      <div className="prose-invert space-y-4 text-ink-200 leading-relaxed [&_strong]:text-white [&_em]:text-ink-100 [&_a]:text-accent-300 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2">
        {children}
      </div>
    </motion.section>
  );
}

function WorkedExample({ title, children }) {
  return (
    <div className="mt-4 rounded-xl border border-accent-500/20 bg-accent-500/5 p-5">
      <div className="text-sm font-semibold text-accent-300 mb-2">{title}</div>
      <div className="text-ink-100 text-sm leading-relaxed space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_strong]:text-white">
        {children}
      </div>
    </div>
  );
}

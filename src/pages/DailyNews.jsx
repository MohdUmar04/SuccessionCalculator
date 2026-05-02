import { motion } from "framer-motion";
import { Newspaper, Quote } from "lucide-react";
import familyPortrait from "../assets/news/p1_img1.png";
import lastWill from "../assets/news/p2_img1.png";
import gravestones from "../assets/news/p2_img2.png";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] },
  }),
};

export default function DailyNews() {
  return (
    <article className="max-w-4xl mx-auto space-y-10">
      {/* Masthead */}
      <motion.header
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-white/15 py-3 text-[11px] uppercase tracking-[0.25em] text-ink-300">
          <span className="font-semibold text-white">Special Edition</span>
          <span className="font-display text-xl tracking-[0.35em] text-white">
            The Daily News
          </span>
          <span>2 May 2026 · P.7</span>
        </div>

        <div className="chip">
          <Newspaper className="w-3.5 h-3.5 text-accent-300" />
          Vol. 01 · Salford &amp; Co.
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
          3 and a{" "}
          <span className="bg-gradient-to-r from-accent-300 to-amber-200 bg-clip-text text-transparent">
            ½ Myths
          </span>
        </h1>

        <p className="text-ink-200 text-lg md:text-xl leading-relaxed italic">
          “What really happens to your assets after death: busting the biggest
          legal myths.”
        </p>

        <p className="text-[11px] uppercase tracking-[0.3em] text-ink-400">
          History lives quietly in everyday moments
        </p>
      </motion.header>

      {/* Myth I */}
      <Myth
        number="I"
        title="Nomination transfers ownership"
        image={familyPortrait}
        imageAlt="Vintage family portrait"
        imageSide="right"
      >
        <p>
          In the absence of a valid will, a <strong>nominee is not the
          rightful owner</strong> of the assets — they are liable to transfer
          them to the legal heir as per the succession act. They are
          responsible for the nominated property after the death of the
          intestate, and must hand it over when the legal heirs make a claim.
        </p>
        <p>
          A nominee is essentially responsible for receiving and holding the
          assets until they are transferred to the legal heir. After the death
          of the intestate, even the nominated assets form a part of the
          deceased's property. Even though the nominee is a trustee or
          receiver of such assets, <em>legal heirs remain the rightful
          owners</em>. The purpose of nomination is limited to providing a
          method to transfer assets easily, quickly and efficiently — it does
          not extend to the determination of ownership. Hence, the nominee
          does not take the place of a legal heir.
        </p>

        <Illustration>
          <strong>Illustration —</strong> SAM, an employee, nominates his
          close friend CAM for his bank account. He unfortunately dies in a
          car accident without making a will. After his death, the bank
          releases fifty lakhs to CAM as the nominee. However, SAM's wife
          Khaytani claims the money as his legal heir. This creates a
          dispute. Although CAM received the money, he is not the rightful
          owner — he is holding the fifty lakhs on behalf of the legal heirs
          and is bound to transfer it to them according to succession law.
        </Illustration>
      </Myth>

      {/* Myth II */}
      <Myth
        number="II"
        title="Nomination bypasses your estate"
        image={lastWill}
        imageAlt="Last Will and Testament document"
        imageSide="left"
      >
        <p>
          There is a myth that life insurance passes outside your estate —
          that when you die, the policy money goes directly to your family,
          cleanly and quickly, bypassing succession disputes entirely. Almost
          every insurance agent will tell you this. It is not entirely wrong,
          but it is not entirely right either, and the gap between the two is
          where most families get hurt.
        </p>
        <p>
          What is true is that the insurer pays the nominee directly, without
          waiting for probate or a succession certificate. But fast payment
          to the nominee is not the same thing as the money leaving your
          estate permanently. Under the position established by the Supreme
          Court in <em>Sarbati Devi v. Usha Devi</em>, the money the nominee
          receives is still treated as part of your estate for the purposes
          of succession law. Your legal heirs can come after it. The nominee
          may be holding it as a trustee without even knowing it.
        </p>
        <p>
          This is exactly what happened in <em>LIC v. Deepika Dahiya</em>,
          where a widow wrote to LIC asking them not to pay the mother who
          was nominated before the marriage. LIC paid the mother anyway, the
          Commission held LIC had done nothing wrong, and the widow was left
          to pursue the mother in a succession court at her own expense —
          while the money was already gone.
        </p>
      </Myth>

      {/* Myth III */}
      <Myth
        number="III"
        title="Your will overrides your nomination"
        imageSide="right"
      >
        <p>
          Many people treat their will as the final word on everything they
          own, including their life insurance. So they nominate one person
          early on, change their mind years later, write a will leaving the
          policy money to someone else entirely, and assume the will
          controls. It feels logical — a will is a considered, formal,
          legally executed document. Surely it supersedes a form filled out
          at the time of buying the policy.
        </p>
        <p>
          <strong>It does not work that way.</strong> The nomination and the
          will operate in completely separate legal spaces. When you die, the
          insurer looks at one thing only: the name registered in its records
          as nominee. It does not read your will. It is not required to. It
          will not wait to see if a will surfaces. It pays the nominee on
          record and closes its file, and that payment is a complete and
          valid discharge of its liability — regardless of what your will
          says about the money.
        </p>
        <p>
          What the will <em>can</em> do is create a claim afterwards. The
          person you named in your will can go to court and argue that the
          nominee received the money as a trustee and must hand it over. But
          that is a succession dispute, fought in court, at considerable time
          and expense, after the money has already left the insurer's hands
          and landed with the nominee. The will does not stop the payment —
          it only gives someone a basis to chase the money once it has
          already moved. For most families, by the time that process
          concludes, the damage — financial and relational — is already done.
        </p>
      </Myth>

      {/* Myth ½ */}
      <Myth
        number="½"
        title="A person can be nominated for the family pension"
        image={gravestones}
        imageAlt="Old gravestones in a cemetery"
        imageSide="left"
      >
        <p>
          There is often a widespread misconception that a government servant
          can nominate a beneficiary for family pension. Employees often try
          to assign a specific relative — an adult child or a parent — as the
          nominee of the pension in their service records, with the
          assumption that this nomination would allow them to choose who gets
          to take over the benefits upon death.
        </p>
        <p>
          However, this completely misunderstands how the family pension
          operates. Unlike contributory assets such as the provident fund,
          the family pension is <strong>not considered an asset of the
          employee</strong>. Rather, it is a statutory welfare benefit which
          arises only after the employee dies.
        </p>
        <p>
          There is no provision in Central and Karnataka service rules which
          allows for nomination of people for family pension. Instead, these
          rules contain a code which pre-determines the eligible relatives
          and sets an order of priority — spouse first, followed by children
          and then other dependants. Since the right is governed by statute,
          it cannot be diverted through nomination or will.
        </p>
      </Myth>

      {/* Footer rule */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
        className="border-t border-white/15 pt-6 flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-[0.25em] text-ink-400"
      >
        <span>Vol. 01</span>
        <span>Salford &amp; Co.</span>
        <span>The Daily News</span>
      </motion.div>
    </article>
  );
}

function Myth({ number, title, children, image, imageAlt, imageSide = "right" }) {
  const hasImage = Boolean(image);
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      className="space-y-5"
    >
      <div className="flex items-baseline gap-4 border-b border-white/10 pb-3">
        <span className="font-display text-3xl md:text-4xl text-accent-300 font-bold">
          Myth {number}
        </span>
        <h2 className="font-display text-xl md:text-2xl font-semibold tracking-tight">
          {title}
        </h2>
      </div>

      <div
        className={`grid gap-6 ${
          hasImage ? "md:grid-cols-3" : "md:grid-cols-1"
        }`}
      >
        {hasImage && imageSide === "left" && (
          <figure className="md:col-span-1">
            <img
              src={image}
              alt={imageAlt}
              className="w-full h-auto rounded-xl border border-white/10 shadow-lg"
            />
          </figure>
        )}

        <div
          className={`prose-news space-y-4 text-ink-200 leading-relaxed ${
            hasImage ? "md:col-span-2" : ""
          }`}
        >
          {children}
        </div>

        {hasImage && imageSide === "right" && (
          <figure className="md:col-span-1 md:order-last">
            <img
              src={image}
              alt={imageAlt}
              className="w-full h-auto rounded-xl border border-white/10 shadow-lg"
            />
          </figure>
        )}
      </div>
    </motion.section>
  );
}

function Illustration({ children }) {
  return (
    <div className="relative rounded-xl border border-accent-400/30 bg-accent-500/5 p-5 mt-2">
      <Quote className="absolute -top-3 -left-3 w-6 h-6 text-accent-300 bg-ink-900 rounded-full p-1 border border-accent-400/30" />
      <p className="text-ink-100 text-[0.95rem] leading-relaxed">{children}</p>
    </div>
  );
}

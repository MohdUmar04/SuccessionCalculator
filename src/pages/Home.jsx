import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Scale,
  Users,
  Cross,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Calculator,
  UserCheck,
  FileText,
  Compass,
  Newspaper,
} from "lucide-react";

function YoutubeIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
    </svg>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] },
  }),
};

export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-800/70 to-ink-900/60 p-8 md:p-14">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="relative max-w-3xl space-y-5"
        >
          <motion.div variants={fadeUp} custom={0} className="chip">
            <Sparkles className="w-3.5 h-3.5 text-accent-300" />
            Indian Succession Act, 1925 · Parsi & Christian
          </motion.div>
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]"
          >
            Understand your
            <span className="bg-gradient-to-r from-accent-300 to-amber-200 bg-clip-text text-transparent">
              {" "}intestate shares{" "}
            </span>
            in minutes.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-ink-200 text-lg md:text-xl leading-relaxed"
          >
            An interactive calculator that models every realistic scenario of Parsi and Christian
            succession under Indian law — widow/widower, children, parents, siblings, predeceased
            descendants, and remote kindred — and shows how the estate is divided.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="pt-2 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/parsi" className="btn-primary">
                <Users className="w-4 h-4" />
                Parsi Calculator
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/christian" className="btn-ghost">
                <Cross className="w-4 h-4" />
                Christian Calculator
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://youtu.be/UGhHE7ygV-I"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-ink-100 border border-red-500/40 hover:border-red-400/60 hover:bg-red-500/10 transition-all"
              >
                <YoutubeIcon className="w-4 h-4 text-red-500" />
                Watch on YouTube
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-300">
              <span className="text-ink-400 uppercase tracking-[0.2em] text-[11px]">
                Or read
              </span>
              <Link
                to="/news"
                className="group inline-flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Newspaper className="w-4 h-4 text-accent-300" />
                Daily News
                <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </Link>
              <span className="text-ink-500">·</span>
              <Link
                to="/article"
                className="group inline-flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <BookOpen className="w-4 h-4 text-accent-300" />
                The full article
                <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature cards */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="section-title">What you can do here</h2>
            <p className="text-ink-300 mt-2">Four focused tools, one clean experience.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Users,
              title: "Parsi Calculator",
              desc: "Division under Sections 50–56 of the Act, including the post-1991 equal-share rules and predeceased descendants.",
              to: "/parsi",
              color: "from-orange-400/30 to-pink-400/20",
            },
            {
              icon: Cross,
              title: "Christian Calculator",
              desc: "Division under Sections 31–49, covering widow + descendants, kindred, and rules where there are no lineal descendants.",
              to: "/christian",
              color: "from-sky-400/30 to-indigo-400/20",
            },
            {
              icon: Newspaper,
              title: "Daily News",
              desc: "A newspaper-style read on the biggest myths around nomination, wills, and what really happens to your assets after death.",
              to: "/news",
              color: "from-rose-400/30 to-amber-400/20",
            },
            {
              icon: BookOpen,
              title: "Article",
              desc: "A plain-language explainer on how intestate succession is actually computed — with worked examples.",
              to: "/article",
              color: "from-emerald-400/30 to-lime-400/20",
            },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
            >
              <Link
                to={c.to}
                className="group relative block h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-accent-400/40 transition-all"
              >
                <div
                  className={`absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br ${c.color} blur-2xl`}
                />
                <div className="relative space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 grid place-items-center">
                    <c.icon className="w-5 h-5 text-accent-300" />
                  </div>
                  <h3 className="text-xl font-semibold">{c.title}</h3>
                  <p className="text-ink-300 text-sm leading-relaxed">{c.desc}</p>
                  <div className="inline-flex items-center gap-1 text-accent-300 text-sm font-medium pt-2">
                    Open <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Calculator,
              title: "Scenario-aware",
              desc: "Handles widows/widowers, multiple children, predeceased children leaving heirs, parents, and full/half siblings.",
            },
            {
              icon: Scale,
              title: "Faithful to the Act",
              desc: "Mirrors the share rules laid down in the Indian Succession Act, 1925 including the Parsi amendment of 1991.",
            },
            {
              icon: ShieldCheck,
              title: "Transparent math",
              desc: "Each distribution shows which rule triggered and the exact rupee amount assigned to every heir, with derived percentages.",
            },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="glass p-6"
            >
              <div className="w-10 h-10 rounded-lg bg-accent-500/15 border border-accent-500/20 grid place-items-center mb-4">
                <c.icon className="w-5 h-5 text-accent-300" />
              </div>
              <h4 className="font-semibold text-lg mb-1">{c.title}</h4>
              <p className="text-ink-300 text-sm leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Key concepts */}
      <section>
        <div className="mb-8">
          <h2 className="section-title">Before you begin: a few essentials</h2>
          <p className="text-ink-300 mt-2">
            Quick context that shapes how succession actually works in India.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: Scale,
              title: "What is a Legal Heir?",
              desc: "A legal heir is the person chosen by law to inherit the property, assets, and liabilities of a deceased individual. It does not depend on any nomination or beneficiary designation — it is determined entirely by succession law. The closest family members (spouse, children, parents) are usually the legal heirs; in their absence, the law follows a defined sequence through the extended family.",
            },
            {
              icon: UserCheck,
              title: "What is a Nominee?",
              desc: "A nominee is someone named by a living person to receive an asset — like a life insurance payout or a bank deposit — after their death. However, the nominee is only a custodian or facilitator: they receive the asset but do not become its legal owner. The Supreme Court of India and several High Courts have repeatedly affirmed that the legal heirs remain the rightful owners.",
            },
            {
              icon: FileText,
              title: "Insurance Act, 1938",
              desc: "The Insurance Act, 1938 is the principal legislation governing insurance in India. From a succession standpoint, the key provisions are those on nomination — particularly Section 39. Naming a nominee ensures claims are paid out promptly, but it does not override the rights of legal heirs under the applicable succession law.",
            },
            {
              icon: Compass,
              title: "Who is this site for?",
              desc: "This website is built for members of the Christian and Parsi communities, whose succession is governed by the Indian Succession Act, 1925 — not by religion-specific personal laws like the Hindu Succession Act. If you belong to either community and want to understand how your assets would be distributed on your demise, this is the right place.",
            },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className="glass p-6"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-accent-500/15 border border-accent-500/20 grid place-items-center">
                  <c.icon className="w-5 h-5 text-accent-300" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{c.title}</h3>
                  <p className="text-ink-300 text-sm leading-relaxed">{c.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-6 text-sm text-ink-200">
        <strong className="text-yellow-300">Disclaimer:</strong> This tool is for educational reference
        only. Real estates involve wills, debts, joint ownership, agricultural land, domicile, and
        religion-specific rules that a qualified lawyer should interpret. Always consult a legal
        professional for any binding decision.
      </section>
    </div>
  );
}

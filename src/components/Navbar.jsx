import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Scale, Home as HomeIcon, Users, Cross, BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";

const tabs = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/parsi", label: "Parsi Calculator", icon: Users },
  { to: "/christian", label: "Christian Calculator", icon: Cross },
  { to: "/article", label: "Article", icon: BookOpen },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-ink-900/70 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 group">
            <motion.div
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 12 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 grid place-items-center shadow-glow"
            >
              <Scale className="w-5 h-5 text-ink-900" />
            </motion.div>
            <div className="leading-tight">
              <div className="font-display text-lg font-bold">Succession<span className="text-accent-400">.</span>in</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-ink-300">Indian Succession Act, 1925</div>
            </div>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            {tabs.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `relative px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive ? "text-white" : "text-ink-200 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="active-pill"
                        className="absolute inset-0 -z-10 rounded-lg bg-white/10 border border-white/10"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden w-10 h-10 grid place-items-center rounded-lg border border-white/10 bg-white/5"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            className="md:hidden border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {tabs.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                      isActive ? "bg-white/10 text-white" : "text-ink-200"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

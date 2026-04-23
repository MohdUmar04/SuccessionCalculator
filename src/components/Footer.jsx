import { Scale } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-ink-300">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-accent-400" />
          <span>Succession.in — an educational tool, not legal advice.</span>
        </div>
        <div className="flex items-center gap-4">
          <span>© {new Date().getFullYear()} All illustrative calculations per the Indian Succession Act, 1925.</span>
        </div>
      </div>
    </footer>
  );
}

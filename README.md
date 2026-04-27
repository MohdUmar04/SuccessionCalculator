# Succession Calculator

An interactive, responsive web app that computes **rupee-level intestate distributions** for Parsis and Christians under the **Indian Succession Act, 1925**, with first-class handling of assets, lifetime gifts, full / partial wills and nominee allocations.

Built with React + Vite, Tailwind CSS, Framer Motion and Recharts.

> ⚠️ **Educational tool, not legal advice.** Real estates involve wills, debts, joint ownership, domicile, conversion and religion-specific rules that a qualified lawyer should interpret. Always consult a legal professional for any binding decision.

---

## Features

- **Home** — Landing page with an overview of the two schemes and the article.
- **Parsi Succession Calculator** — Sections 50–56 of the Act (post the 1991 amendment): Section 51 unit math (spouse + each child = 1 unit, each parent = 0.5 unit), Section 53 representation for predeceased sons (widow + grandchildren + per-stirpes great-grandchildren) and predeceased daughters, and Section 54 + Schedule II when there are no lineal descendants.
- **Christian Succession Calculator** — Sections 31–49: §33 (spouse 1/3, descendants 2/3 per stirpes), §34 (spouse + parents, ½ each), parents-only, siblings (with per-stirpes nephews/nieces) and a further-kindred bucket.
- **Assets, gifts and nominees** — Both calculators take house / bank / insurance / pension and a lifetime-gift figure; insurance and pension can be diverted to nominees so they bypass the estate.
- **Wills** — A full will short-circuits the calculation; a partial will trims the residue by a configurable percentage before applying the intestate rules.
- **Article** — Plain-English explainer with worked examples for both schemes.
- Live-updating pie chart and per-heir breakdown showing rupee amounts and derived percentages.
- Sticky animated navbar, smooth page transitions, responsive layout (mobile nav drawer), dark glassmorphism styling.

## Tech stack

| Layer        | Library                         |
| ------------ | ------------------------------- |
| Build / dev  | Vite                            |
| UI framework | React 19                        |
| Styling      | Tailwind CSS 3, custom tokens   |
| Animation    | Framer Motion                   |
| Charts       | Recharts                        |
| Icons        | lucide-react                    |
| Routing      | react-router-dom                |

## Getting started

> Requires Node.js **≥ 20.19** (or ≥ 22.12) — Vite 8 will not run on older versions.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (hot reload at http://localhost:5173)
npm run dev

# 3. Build for production
npm run build

# 4. Preview the production build locally
npm run preview

# 5. Lint the source
npm run lint

# 6. Run the unit tests for the share-computation logic
node scripts/test-logic.mjs
```

## Project structure

```
SuccessionCalculator/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/          # Reusable UI primitives
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── NumberStepper.jsx
│   │   ├── ResultBreakdown.jsx
│   │   └── Toggle.jsx
│   ├── logic/               # Pure share-computation functions
│   │   ├── parsi.js
│   │   └── christian.js
│   ├── pages/               # Route-level screens (tabs)
│   │   ├── Home.jsx
│   │   ├── ParsiCalculator.jsx
│   │   ├── ChristianCalculator.jsx
│   │   └── Article.jsx
│   ├── App.jsx              # Router + page-transition shell
│   ├── App.css
│   ├── index.css            # Tailwind + global design tokens
│   └── main.jsx             # React entry
├── scripts/
│   └── test-logic.mjs       # Headless tests for the logic engines
├── docs/
│   └── legacy/              # Original spec .htm files used as the source of truth
│       ├── parsi.htm
│       └── christian.htm
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── eslint.config.js
├── package.json
└── README.md
```

## How the calculation works

The engine works in **rupee amounts**, not normalised fractions. Each calculation runs in four phases:

1. **Estate assembly.** `house + bank + insurance + pension − lifetime gifts` produces the gross estate. If "Nominee gets the asset directly" is on, the insurance and pension proceeds are pulled out of the estate and shown separately as nominee allocations.
2. **Will gate.** A full will short-circuits the calculation entirely (no intestate distribution is performed). A partial will trims the residue by the supplied percentage before the intestate rules run.
3. **Intestate distribution.** The remaining estate is divided among the heirs according to the rules below. Predeceased descendants are handled **per stirpes**: their branch is treated as a single share which is then sub-divided among their own heirs.
4. **Presentation.** The breakdown panel renders rupee amounts and derived percentages, plus a pie chart, applied-rule notes and any §53 / §54 hand-off warnings.

### Rules that are modelled

| Section | Scheme    | Rule |
| ------- | --------- | ---- |
| §33     | Christian | Spouse 1/3, lineal descendants 2/3 (per stirpes) |
| §34     | Christian | No descendants: spouse 1/2, parent(s) 1/2 (split equally) |
| §§36–40 | Christian | Per-stirpes distribution among descendants |
| §§42–47 | Christian | Parents-only, siblings (with per-stirpes nephews/nieces) and further-kindred bucket |
| §51     | Parsi     | Spouse + each child = 1 unit each |
| §51(2)  | Parsi     | Each surviving parent = 0.5 unit |
| §53(a)  | Parsi     | Predeceased son's share → his widow + (great-)grandchildren per stirpes; widow-only with no descendants → ½ share + Schedule II hand-off note |
| §53(b)  | Parsi     | Predeceased daughter's share → her children only |
| §54     | Parsi     | No lineal descendants → spouse 1/2, residue divided equally among Schedule II next of kin (parents + siblings, with per-stirpes nephews/nieces) |
| —       | Both      | Nominee override for insurance / pension (allocations sit outside the estate) |
| —       | Both      | Full will (short-circuit) and partial will (residue trim) |
| —       | Both      | Lifetime-gift deduction from the gross estate |

### Rules that are **not** modelled

- Disqualification of heirs (e.g. murder of the intestate)
- Conversion between religions mid-life
- Foreign domicile and cross-border estate rules
- Debts, liabilities and estate duty (only lifetime gifts are deducted)
- Agricultural land subject to state-specific tenancy laws
- Adopted, illegitimate or posthumous children
- Section 33A (the ₹5,000 floor for Indian Christian widows with no descendants) — the calculator falls through to §34 for this case
- Half-blood siblings, grandparents and other remote Schedule II classes (only parents, full siblings and their children are modelled)

For any of the above, consult qualified counsel.

## License

This project is released for personal and educational use. No warranty of fitness for any legal purpose is expressed or implied.

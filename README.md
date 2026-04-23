# Succession Calculator

An interactive, responsive web app that computes **intestate succession shares** for Parsis and Christians under the **Indian Succession Act, 1925**.

Built with React + Vite, Tailwind CSS, Framer Motion and Recharts.

> ⚠️ **Educational tool, not legal advice.** Real estates involve wills, debts, joint ownership, domicile, conversion and religion-specific rules that a qualified lawyer should interpret. Always consult a legal professional for any binding decision.

---

## Features

- **Home** — Landing page with an overview of the two schemes and the article.
- **Parsi Succession Calculator** — Sections 50–56 of the Act (as amended by Act 51 of 1991), including the post-1991 equal-share rule, Section 53 representation for predeceased descendants, and Section 54 + Schedule II fallback when there are no lineal descendants.
- **Christian Succession Calculator** — Sections 31–49, covering widow + descendants (§33), Section 33A for Indian Christians with no lineal descendants (the ₹5,000 floor rule), §34 half-and-half, and §§42–48 kindred distribution.
- **Article** — Plain-English explainer with worked examples for both schemes.
- Live-updating pie chart and per-heir breakdown showing percentages and (optional) rupee amounts.
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
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── eslint.config.js
├── package.json
└── README.md
```

## How the calculation works

Each heir is assigned a **raw fraction** driven by the applicable section of the Act — `1` for a Parsi child, `0.5` for a Parsi parent, `1/3` for a Christian widow with descendants, and so on. The raw fractions are then **normalised**: the calculator sums them and divides each by the total, so the resulting shares add up to 100 % of the estate.

Predeceased descendants are handled **per stirpes**: the deceased branch's share is computed as if they had died intestate at that moment, then distributed among their own heirs recursively.

If you enter an estate value, each percentage is multiplied by that value to produce rupee amounts. The Christian calculator additionally applies Section 33A's ₹5,000 threshold when the flag "Indian Christian" is enabled and there are no lineal descendants.

### Rules that are modelled

| Section | Scheme | Rule |
| ------- | ------ | ---- |
| §33     | Christian | Widow 1/3, lineal descendants 2/3 |
| §33A    | Christian | Indian Christian, no descendants → ₹5,000 + ½ of remainder to widow |
| §34     | Christian | Widow + kindred, no descendants → ½ each |
| §§36–40 | Christian | Per-stirpes distribution among descendants |
| §§42–48 | Christian | Kindred distribution when no descendants |
| §51     | Parsi | Widow and each child take equal shares |
| §51(2)  | Parsi | Each parent takes half of a child's share |
| §53(a)  | Parsi | Predeceased son's share → his widow + children |
| §53(b)  | Parsi | Predeceased daughter's share → her children only |
| §54     | Parsi | No lineal descendants → widow ½, residue to Schedule II |

### Rules that are **not** modelled

- Wills, codicils and testamentary trusts (this is an **intestate** calculator)
- Disqualification of heirs (e.g. murder of the intestate)
- Conversion between religions mid-life
- Foreign domicile and cross-border estate rules
- Debts, liabilities and estate duty
- Agricultural land subject to state-specific tenancy laws
- Adopted, illegitimate or posthumous children

For any of the above, consult qualified counsel.

## License

This project is released for personal and educational use. No warranty of fitness for any legal purpose is expressed or implied.

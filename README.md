# Tromsø Flaggfotball

Website for Tromsø Flaggfotball — Tromsø's first flag football club. Contact-free American football for all ages and skill levels, located at 69°N.

**Live site:** Built and deployed via [Lovable](https://lovable.dev)

## About

This is a single-page React application that serves as the club's website. It includes:

- **Hero section** with the club logo and arctic-themed background
- **Interactive field diagram** — an SVG-based visualization of flag football positions and formations (offense & defense), with animated player movement and clickable tooltips
- **Position cards** — color-coded descriptions of each position (QB, RB, C, WR, Rusher, DB, Safety) with NFL examples
- **Training info** — schedule, location, and what to bring
- **Coach profiles**
- **"Get started" links** — social media, registration, and licensing info
- **FAQ section**
- **"How I Did It" page** — a behind-the-scenes walkthrough of how the site was built using GPT-5.2 and Lovable

## Tech Stack

- **React 18** with TypeScript
- **Vite** — dev server and build tool
- **Tailwind CSS** — utility-first styling with a custom arctic color palette (`natt`, `fjord`, `nordlys`, `is`)
- **shadcn/ui** — Radix-based UI component library (buttons, accordions, tooltips, etc.)
- **React Router** — client-side routing (`/` and `/how-i-did-it`)
- **TanStack React Query** — data fetching/caching
- **Lucide React** — icons
- **Recharts** — charting library
- **Three.js / React Three Fiber** — 3D capabilities
- **Vitest** — test runner with jsdom environment

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm, yarn, or [bun](https://bun.sh/)

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

The site starts at [http://localhost:8080](http://localhost:8080).

### Build for production

```bash
npm run build
```

Output is written to `dist/`.

### Preview the production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

### Run tests

```bash
npm run test
```

## Project Structure

```
src/
├── assets/            # Images (logo, hero background, Canva original)
├── components/
│   ├── FieldDiagram.tsx   # Interactive SVG field diagram
│   ├── NavLink.tsx        # Wrapper around React Router's NavLink
│   └── ui/                # shadcn/ui components
├── hooks/             # Custom hooks (use-mobile, use-toast)
├── lib/               # Utilities (cn helper)
├── pages/
│   ├── Index.tsx      # Main landing page
│   ├── HowIDidIt.tsx  # Behind-the-scenes build story
│   └── NotFound.tsx   # 404 page
├── test/              # Test setup and example test
├── App.tsx            # Root component with routing
├── main.tsx           # Entry point
└── index.css          # Global styles and CSS variables
```

## Design

The visual identity draws from Tromsø's arctic landscape:

- **Fonts:** Syne (headings) + Outfit (body text)
- **Colors:** Dark night-blue backgrounds, fjord-teal secondary, nordlys-green primary accents, and ice-mint highlights — all defined as HSL CSS custom properties

# Microfrontend Benchmark — Project Documentation

> **Academic Research Project**  
> A controlled benchmarking study comparing Microfrontend (Module Federation) and Monolithic web application architectures using real Web Vitals measurements collected via Lighthouse CI.

---

## Table of Contents

- [Microfrontend Benchmark — Project Documentation](#microfrontend-benchmark--project-documentation)
  - [Table of Contents](#table-of-contents)
  - [1. Project Overview](#1-project-overview)
  - [2. Monorepo Structure](#2-monorepo-structure)
  - [3. Tech Stack](#3-tech-stack)
    - [Application Layer](#application-layer)
    - [Build \& Tooling](#build--tooling)
    - [Benchmarking \& CI](#benchmarking--ci)
    - [Infrastructure](#infrastructure)
  - [4. Why Nx?](#4-why-nx)
    - [1. Unified Project Graph](#1-unified-project-graph)
    - [2. Code Sharing Without Publishing](#2-code-sharing-without-publishing)
    - [3. Consistent Build Targets](#3-consistent-build-targets)
    - [4. Module Federation Plugin](#4-module-federation-plugin)
    - [5. Caching](#5-caching)
    - [6. Scalability](#6-scalability)
  - [5. Applications](#5-applications)
    - [5.1 Microfrontend App (`mfe-web-app`)](#51-microfrontend-app-mfe-web-app)
      - [Runtime Module Loading](#runtime-module-loading)
      - [Remote Applications](#remote-applications)
    - [5.2 Monolith App (`monolith-web-app`)](#52-monolith-app-monolith-web-app)
  - [6. Shared UI Modules (`libs/modules`)](#6-shared-ui-modules-libsmodules)
  - [7. Tooling](#7-tooling)
    - [7.1 `web-vitals-benchmark`](#71-web-vitals-benchmark)
      - [Key Files](#key-files)
      - [Available Scripts](#available-scripts)
      - [Collected Metrics](#collected-metrics)
    - [7.2 `benchmark-visualizer`](#72-benchmark-visualizer)
      - [Key Features](#key-features)
      - [Architecture](#architecture)
      - [Running the Visualizer](#running-the-visualizer)
    - [7.3 `benchmark-screenshots`](#73-benchmark-screenshots)
      - [Key Scripts](#key-scripts)
      - [Capture Matrix](#capture-matrix)
  - [8. Data Collection \& Processing Pipeline](#8-data-collection--processing-pipeline)
    - [Aggregation Logic (`index.ts`)](#aggregation-logic-indexts)
  - [9. CI/CD — Lighthouse CI Workflow](#9-cicd--lighthouse-ci-workflow)
    - [Parallel Strategy](#parallel-strategy)
  - [10. Infrastructure \& Deployment](#10-infrastructure--deployment)
    - [Amazon EC2](#amazon-ec2)
    - [Cloudflare R2](#cloudflare-r2)
    - [Docker Compose](#docker-compose)
  - [11. Running the Project](#11-running-the-project)
    - [Prerequisites](#prerequisites)
    - [Install Dependencies](#install-dependencies)
    - [Development — Monolith](#development--monolith)
    - [Development — MFE](#development--mfe)
    - [Production — Docker Compose](#production--docker-compose)
    - [Benchmark Visualizer](#benchmark-visualizer)
    - [Automated Screenshots](#automated-screenshots)
    - [Running Lighthouse Locally](#running-lighthouse-locally)
  - [12. Architecture Deep Dive](#12-architecture-deep-dive)
    - [12.1 Microfrontend Architecture](#121-microfrontend-architecture)
      - [Module Federation Initialization Flow](#module-federation-initialization-flow)
      - [Shared Dependencies](#shared-dependencies)
    - [12.2 Monolith Architecture](#122-monolith-architecture)
    - [12.3 Optimization Variants (MFE)](#123-optimization-variants-mfe)
  - [13. Benchmark Dimensions](#13-benchmark-dimensions)
    - [Cold vs. Warm Start](#cold-vs-warm-start)
    - [Network Throttling Profiles](#network-throttling-profiles)
  - [14. Statistical Analysis](#14-statistical-analysis)
    - [Descriptive Statistics](#descriptive-statistics)
    - [Welch's Two-Sample t-Test](#welchs-two-sample-t-test)
  - [15. Data Storage Layout](#15-data-storage-layout)
  - [16. Research Reproducibility](#16-research-reproducibility)
  - [17. Annotated Code Reference](#17-annotated-code-reference)
    - [17.1 GitHub Actions — `lighthouse-ci.yml`](#171-github-actions--lighthouse-ciyml)
      - [Setup Job: Building the Parallel Matrix](#setup-job-building-the-parallel-matrix)
      - [Lighthouse Job: Running Measurements](#lighthouse-job-running-measurements)
      - [Aggregate and Publish Jobs](#aggregate-and-publish-jobs)
    - [17.2 `web-vitals-benchmark` — Core Code](#172-web-vitals-benchmark--core-code)
      - [`lighthouserc.cold.cjs` — Cold Start Configuration](#lighthouserccoldcjs--cold-start-configuration)
      - [`index.ts` — Aggregation Entry Point](#indexts--aggregation-entry-point)
      - [`getCoreData.ts` — Metric Extraction](#getcoredatats--metric-extraction)
      - [`getBenchmarkSummaries.ts` — Statistical Aggregation](#getbenchmarksummariests--statistical-aggregation)
    - [17.3 `benchmark-visualizer` — Core Code](#173-benchmark-visualizer--core-code)
      - [`dataLoader.ts` — Manifest-Driven Data Fetching](#dataloaderts--manifest-driven-data-fetching)
      - [`ttest.ts` — Welch's t-Test Implementation](#ttestts--welchs-t-test-implementation)
    - [17.4 `benchmark-screenshots` — Core Code](#174-benchmark-screenshots--core-code)
      - [`capture-pages.ts` — Full-Page Automated Screenshot Loop](#capture-pagests--full-page-automated-screenshot-loop)
    - [17.5 Dockerfile — Multi-Stage Build](#175-dockerfile--multi-stage-build)
    - [17.6 MFE — Runtime Module Loading](#176-mfe--runtime-module-loading)
      - [`useModuleFederation.ts` — Multi-Remote Hook](#usemodulefederationts--multi-remote-hook)
      - [`RemoteModuleRenderer.tsx` — Rendering Remote Components](#remotemodulerenderertsx--rendering-remote-components)
      - [MFE Page — `pages/index.tsx`](#mfe-page--pagesindextsx)
    - [17.7 Monolith — Page Loaders](#177-monolith--page-loaders)
    - [17.8 Module Federation Config — `module-federation.config.ts`](#178-module-federation-config--module-federationconfigts)

---

## 1. Project Overview

This project is an academic benchmarking platform designed to produce rigorous, reproducible performance measurements comparing two frontend architecture patterns:

| Architecture            | Description                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Microfrontend (MFE)** | A Next.js shell application that dynamically loads independently deployed remote modules at runtime using Webpack Module Federation. |
| **Monolith**            | A standard Next.js application that directly imports the same page modules as regular npm packages at build time.                    |

Both applications render **identical pages** (Home, Login, Dashboard) using the **same shared React component libraries** located in `libs/modules`. This controlled equivalence ensures that any measured performance difference is attributable solely to the architectural approach rather than to differing content or UI complexity.

Performance is measured using **Google Lighthouse** run via **Lighthouse CI**, collecting six Core Web Vitals and performance metrics across multiple pages, network conditions, cache states (cold/warm), and MFE optimization configurations. Results are persisted to the repository and visualized in an interactive local dashboard.

---

## 2. Monorepo Structure

The entire project is managed as a single Nx monorepo:

```
microfrontend-benchmark/
├── apps/
│   ├── microfrontend/
│   │   ├── mfe-web-app/            # Next.js MFE shell (host)
│   │   ├── mfe-web-app-e2e/        # Playwright E2E tests for MFE
│   │   └── remotes/
│   │       ├── homeremote/         # Webpack MF remote — Home page
│   │       ├── loginremote/        # Webpack MF remote — Login page
│   │       ├── dashboardremote/    # Webpack MF remote — Dashboard page
│   │       ├── supportremote/      # Webpack MF remote — Support widget
│   │       └── *-e2e/              # Per-remote Playwright E2E tests
│   └── monolith/
│       ├── monolith-web-app/       # Next.js monolith app
│       └── monolith-web-app-e2e/   # Playwright E2E tests for monolith
├── libs/
│   └── modules/
│       ├── home-module/            # Shared React UI for the Home page
│       ├── login-module/           # Shared React UI for the Login page
│       ├── dashboard-module/       # Shared React UI for the Dashboard page
│       └── support-module/         # Shared React UI for the Support widget
├── tools/
│   ├── web-vitals-benchmark/       # Lighthouse CI runner & data aggregator
│   ├── benchmark-visualizer/       # Interactive React dashboard for results
│   └── benchmark-screenshots/      # Playwright-based automated screenshot tool
├── docker/
│   ├── apps/                       # Dockerfiles per application
│   ├── compose/                    # Docker Compose files
│   └── nginx/                      # Nginx reverse proxy configs
└── .github/
    └── workflows/
        └── lighthouse-ci.yml       # GitHub Actions benchmark workflow
```

---

## 3. Tech Stack

### Application Layer

| Category             | Technology                     | Version |
| -------------------- | ------------------------------ | ------- |
| Framework            | [Next.js](https://nextjs.org/) | 14.0.4  |
| Language             | TypeScript                     | ~5.x    |
| UI Library           | React                          | 18.3.1  |
| Styling              | Tailwind CSS                   | 3.2.7   |
| State Management     | Zustand                        | ^4.5.2  |
| Charts (monolith UI) | Recharts                       | ^3.8.1  |
| Module Federation    | `@module-federation/enhanced`  | ^0.21.3 |
| MF Build Plugin      | `@nx/react/module-federation`  | 19.0.0  |

### Build & Tooling

| Category                  | Technology                   |
| ------------------------- | ---------------------------- |
| Monorepo                  | [Nx](https://nx.dev/) 19.0.0 |
| Runtime / Package Manager | [Bun](https://bun.sh/)       |
| Bundler (remotes)         | Webpack (via `@nx/webpack`)  |
| Bundler (libs/visualizer) | Vite (via `@nx/vite`)        |
| Linting                   | ESLint                       |
| Testing (unit)            | Jest / Vitest                |
| Testing (E2E)             | Playwright                   |

### Benchmarking & CI

| Category              | Technology                                                                          |
| --------------------- | ----------------------------------------------------------------------------------- |
| Performance auditing  | [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) (`@lhci/cli` 0.13.0) |
| CI platform           | GitHub Actions                                                                      |
| Screenshot automation | Playwright                                                                          |

### Infrastructure

| Category         | Technology                          |
| ---------------- | ----------------------------------- |
| Containerization | Docker + Docker Compose             |
| Reverse Proxy    | Nginx                               |
| Cloud Hosting    | Amazon EC2 (production deployments) |
| Remote CDN       | Cloudflare R2 (MFE remote bundles)  |

---

## 4. Why Nx?

Nx is the core monorepo management layer for this project. It is used for the following reasons:

### 1. Unified Project Graph

Nx builds an internal dependency graph of all projects (apps, libs, tools). This enables it to understand what has changed and run only the affected build/test tasks — critical in a monorepo with six remotes plus two apps.

### 2. Code Sharing Without Publishing

The shared UI modules in `libs/modules` are consumed directly by both `mfe-web-app` (as a Next.js import) and each MFE remote (via its own compilation). Without Nx path aliases managed in `tsconfig.base.json`, this cross-package import would require publishing packages to npm or complex path management.

### 3. Consistent Build Targets

Nx provides a uniform interface to run build, serve, test, and lint across all projects regardless of the underlying tool (Webpack, Vite, or Next.js):

```bash
nx build mfe-web-app
nx build homeremote
nx serve benchmark-visualizer
nx test dashboard-module
```

### 4. Module Federation Plugin

The `@nx/react/module-federation` plugin automates the boilerplate-heavy Webpack Module Federation configuration. It reads `module-federation.config.ts` per remote and generates the full Webpack config, including shared dependency resolution.

### 5. Caching

Nx caches task outputs. Rebuilding an unchanged remote uses the cached result, significantly accelerating CI and local development iterations.

### 6. Scalability

The architecture can accommodate additional remotes (pages) or additional libs simply by adding new projects — Nx resolves all dependency relationships automatically.

---

## 5. Applications

### 5.1 Microfrontend App (`mfe-web-app`)

**Path:** `apps/microfrontend/mfe-web-app`  
**Technology:** Next.js 14 (Pages Router)  
**Role:** The **host shell** of the MFE architecture.

The host application is a thin Next.js shell. It does not contain any page UI itself. Instead, each route (`/`, `/login`, `/dashboard`) dynamically loads its UI at runtime by fetching JavaScript bundles from independently deployed remote applications:

| Route        | Remotes Loaded                     |
| ------------ | ---------------------------------- |
| `/` (Home)   | `homeremote`, `supportremote`      |
| `/login`     | `loginremote`                      |
| `/dashboard` | `dashboardremote`, `supportremote` |

Remote entry URLs are injected at runtime via environment variables:

- `NX_PUBLIC_HOME_REMOTE`
- `NX_PUBLIC_LOGIN_REMOTE`
- `NX_PUBLIC_DASHBOARD_REMOTE`
- `NX_PUBLIC_SUPPORT_REMOTE`

#### Runtime Module Loading

Loading is handled by a custom `useMultipleModuleFederation` React hook backed by `@module-federation/enhanced/runtime`. The hook:

1. Creates a Module Federation host instance (`createInstance`).
2. Registers the remote application URLs.
3. Dynamically imports the remote module (e.g., `homeremote/Module`).
4. Returns `{ component, loading, error }` state.

The `RemoteModuleRenderer` component renders the loaded component with built-in loading and error states, making each remote integration resilient to transient network failures.

#### Remote Applications

Each remote (`homeremote`, `loginremote`, `dashboardremote`, `supportremote`) is an independent Webpack application exposing a single React component as `./Module`. They are built with `@nx/webpack` + `withModuleFederation` and produce a `remoteEntry.js` file that the host uses to bootstrap each remote's module graph.

All remotes use the same pattern:

```
remotes/{name}/
├── module-federation.config.ts   # MF config: name, exposes, shared deps
├── webpack.config.ts             # Development webpack config
├── webpack.config.prod.ts        # Production webpack config
└── src/
    ├── remote-entry.ts           # Exports the App component as the module
    └── app/
        └── app.tsx               # Renders the corresponding lib module
```

For example, `homeremote/src/app/app.tsx` simply renders `<HomeModule />` from `@mfe-benchmark/home-module` — the shared library.

### 5.2 Monolith App (`monolith-web-app`)

**Path:** `apps/monolith/monolith-web-app`  
**Technology:** Next.js 14 (Pages Router)  
**Role:** The **baseline monolithic** architecture for comparison.

The monolith application directly imports the same shared modules (`@mfe-benchmark/home-module`, `@mfe-benchmark/dashboard-module`, etc.) as standard npm dependencies resolved at build time via Nx path aliases. There is no dynamic remote loading; all code is bundled together at build time.

Pages use Next.js `dynamic()` with `{ ssr: false }` to match the client-side rendering behavior of the MFE counterpart, ensuring a fair comparison:

```tsx
// monolith-web-app/src/pages/index.tsx
const HomeModule = dynamic(() => import('@mfe-benchmark/home-module').then((mod) => mod.HomeModule), { ssr: false });
```

This ensures both architectures render their content on the client side, isolating the architectural overhead (remote loading, module federation bootstrap) as the primary measured variable.

---

## 6. Shared UI Modules (`libs/modules`)

**Path:** `libs/modules/`

The four shared modules are the cornerstone of the experimental validity of this benchmark. By ensuring both applications render **exactly the same UI code**, any performance difference measured is attributable to the architecture, not the content.

| Module             | Package Name                      | Page                     |
| ------------------ | --------------------------------- | ------------------------ |
| `home-module`      | `@mfe-benchmark/home-module`      | Home (`/`)               |
| `login-module`     | `@mfe-benchmark/login-module`     | Login (`/login`)         |
| `dashboard-module` | `@mfe-benchmark/dashboard-module` | Dashboard (`/dashboard`) |
| `support-module`   | `@mfe-benchmark/support-module`   | Support widget (sidebar) |

Each module is a Vite-built React library that:

- Exports a single named component (e.g., `HomeModule`, `DashboardModule`).
- Contains its own components, styles, and logic.
- Is consumed directly in the monolith via static import.
- Is consumed in the MFE via each remote's `app.tsx`, which re-exports the same component.

The `dashboard-module` in particular is the most complex, implementing a full project management-style dashboard UI with sidebar navigation, task management, and a report dashboard section built from atomic design components (organisms → molecules → atoms).

---

## 7. Tooling

### 7.1 `web-vitals-benchmark`

**Path:** `tools/web-vitals-benchmark/`  
**Runtime:** Bun  
**Purpose:** Run Lighthouse CI against deployed applications and aggregate the raw results into structured JSON for downstream analysis.

#### Key Files

| File                           | Purpose                                                                                                              |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `lighthouserc.cold.cjs`        | Lighthouse CI config for **cold start** (storage reset between runs)                                                 |
| `lighthouserc.warm.cjs`        | Lighthouse CI config for **warm start** (storage preserved between runs)                                             |
| `lighthouserc.local.json`      | Config for running against `localhost` during development                                                            |
| `index.ts`                     | Main script: reads `.lighthouseci/*.json`, aggregates metrics, outputs `summary.json`                                |
| `src/getCoreData.ts`           | Extracts the 6 target metrics from a Lighthouse result object                                                        |
| `src/getBenchmarkSummaries.ts` | Computes descriptive statistics (mean, median, mode, min, max, Q1, Q3) and raw t-test data arrays from a set of runs |
| `src/types/benchmarks.ts`      | TypeScript types for all benchmark data structures                                                                   |

#### Available Scripts

```bash
# Run cold-start benchmark (30 runs, storage reset)
bun run lighthouse:cold

# Run warm-start benchmark (30 runs, cache preserved)
bun run lighthouse:warm

# Run with network throttling
bun run lighthouse:cold:4g
bun run lighthouse:cold:3g

# Aggregate existing .lighthouseci/ results to stdout as JSON
bun run dev
```

#### Collected Metrics

All six metrics are extracted from the Lighthouse audit results:

| Metric                         | Lighthouse Audit Key       | Unit           |
| ------------------------------ | -------------------------- | -------------- |
| Speed Index                    | `speed-index`              | ms             |
| First Contentful Paint (FCP)   | `first-contentful-paint`   | ms             |
| Largest Contentful Paint (LCP) | `largest-contentful-paint` | ms             |
| Cumulative Layout Shift (CLS)  | `cumulative-layout-shift`  | unitless score |
| Time to Interactive (TTI)      | `interactive`              | ms             |
| Total Blocking Time (TBT)      | `total-blocking-time`      | ms             |

Each benchmark run consists of **30 Lighthouse iterations** to ensure statistical robustness.

---

### 7.2 `benchmark-visualizer`

**Path:** `tools/benchmark-visualizer/`  
**Runtime:** Vite + React (runs locally, port `4300`)  
**Purpose:** An interactive single-page React application that loads the collected `summary.json` data files and renders charts and statistical tables for human analysis.

#### Key Features

- **Tab navigation** between Warm Start, Cold Start, and Combined Overview scenarios.
- **Page selector** to switch between Home, Login, and Dashboard pages.
- **Network profile selector**: No Throttling, 4G LTE, 3G.
- **Optimization selector** (MFE only): Optimized vs. Non-Optimized.
- **Comparison bar charts** showing MFE vs. Monolith for each metric.
- **Distribution charts** showing the spread of individual Lighthouse runs.
- **Statistical summary tables** with mean, median, Q1/Q3, min/max.
- **Welch's t-test results** directly in the comparison table, with statistical significance (p < 0.05) highlighted.
- **Cross-page comparison** view to compare the same metric across all pages simultaneously.
- **Methodology section** explaining the benchmark approach.

#### Architecture

```
src/
├── app/App.tsx              # Root: state management, tab/page/network/opt selectors
├── components/
│   ├── Header.tsx           # App header and navigation controls
│   ├── ScenarioSection.tsx  # Per-scenario (warm/cold) section with all charts
│   ├── ComparisonBarChart.tsx  # MFE vs Monolith bar chart
│   ├── DistributionChart.tsx   # Box plot / individual run scatter
│   ├── StatisticalTable.tsx    # Detailed stats + t-test table
│   ├── CombinedOverview.tsx    # Side-by-side combined warm+cold view
│   ├── CrossPageComparison.tsx # Single metric across all pages
│   ├── SummaryOverview.tsx     # High-level summary cards
│   ├── MetricCard.tsx          # Individual metric highlight card
│   ├── PageSelector.tsx        # Page tab buttons
│   └── Methodology.tsx         # Benchmark methodology description
├── services/
│   └── dataLoader.ts        # fetch() calls to /data/**/*.json
├── types/
│   └── benchmark.ts         # Shared TS types and constants
└── utils/
    ├── format.ts            # Metric formatting helpers
    └── ttest.ts             # Welch's two-sample t-test implementation
```

The visualizer reads data from `public/data/` using a manifest-driven approach:

1. Fetches `public/data/manifest.json` to discover available pages.
2. For each page, fetches `summary.json` from the path:  
   `/data/{project}/{page}/{scenario}/{network}/{optimization}/summary.json`
3. Computes Welch's t-test in the browser using raw per-run values from `benchmarkTTestTable`.

#### Running the Visualizer

```bash
# From the monorepo root
npm run visualizer:dev
# or
nx serve benchmark-visualizer
```

Then open `http://localhost:4300` in a browser.

---

### 7.3 `benchmark-screenshots`

**Path:** `tools/benchmark-screenshots/`  
**Runtime:** Node.js + Playwright (runs locally)  
**Purpose:** Automated screenshot capture of the benchmark visualizer for use in thesis figures and documentation, eliminating the need for manual screenshots.

#### Key Scripts

```bash
# Install Playwright browser
npm run capture:install

# Capture individual metric screenshots
npm run capture

# Capture full-page screenshots for all combinations
npm run capture:pages

# Run both capture scripts
npm run capture:all
```

#### Capture Matrix

The screenshot tool systematically iterates over every combination of:

- **Pages:** Home, Dashboard, Login
- **Networks:** No Throttling, 4G LTE, 3G
- **Optimizations (MFE):** Optimized, Non-Optimized
- **Scenarios:** Warm Start, Cold Start, Combined Overview

For each combination it:

1. Navigates the benchmark-visualizer UI to that state (clicking selectors programmatically).
2. Scrolls through the page in 600 px steps to force lazy-rendered Recharts SVGs to paint at full size.
3. Scrolls back to the top.
4. Takes a full-page screenshot.

Output is organized as:

```
page-screenshots/
  {page}/
    {network}/
      {optimization}/
        {warm|cold|combined}/
          full-page.png
```

---

## 8. Data Collection & Processing Pipeline

The full pipeline from raw measurement to visualized result is:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  GitHub Actions: lighthouse-ci.yml                                      │
│                                                                         │
│  1. setup job                                                           │
│     Builds page/network/optimization matrices for the parallel strategy │
│                                                                         │
│  2. lighthouse job (parallel matrix)                                    │
│     For each (page × network × optimization × instance):               │
│     a. Install Bun deps                                                 │
│     b. Set benchmark URL (optimized/non-optimized/custom)              │
│     c. Run lhci autorun (30 runs, cold or warm config)                 │
│     d. Upload .lighthouseci/*.json as GitHub artifact                  │
│                                                                         │
│  3. aggregate-results job (parallel matrix, one per combination)        │
│     a. Download all artifacts for (page × network × optimization)      │
│     b. Merge all lhr-*.json files into merged-results/                 │
│     c. Run `bun run dev` → stdout → summary.json                       │
│        (reads merged lhr files, computes stats + t-test table)         │
│     d. Upload merged-results/ as artifact                              │
│                                                                         │
│  4. combine-results job                                                 │
│     a. Download all merged artifacts                                    │
│     b. Organize into:                                                   │
│        combined-results/{project}/{page}/{mode}/{network}/{opt}/        │
│     c. Upload as lighthouse-combined-results artifact                  │
│                                                                         │
│  5. publish-to-visualizer job                                           │
│     a. Download combined-results artifact                               │
│     b. Copy into tools/benchmark-visualizer/public/data/               │
│     c. git commit + push (with [skip ci])                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

After the CI workflow completes, the benchmark data is committed directly to the repository. The `benchmark-visualizer` reads this data from `public/data/` at runtime.

### Aggregation Logic (`index.ts`)

The `web-vitals-benchmark` aggregation script:

1. Scans `.lighthouseci/lhr-*.json` files.
2. Extracts the 6 core metrics from each Lighthouse report via `getCoreData()`.
3. Computes per-metric descriptive statistics via `getBenchmarkSummary()`.
4. Builds the raw per-run value arrays needed for t-testing via `getBenchmarkTTestTable()`.
5. Outputs a structured `summary.json`:

```json
{
  "reportVersion": "2.0",
  "lighthouseResults": [ /* one entry per run */ ],
  "benchmarkSummary": {
    "firstContentfulPaint": { "mean": 918, "median": 916, "q1": 900, "q3": 940, ... },
    ...
  },
  "benchmarkTTestTable": {
    "firstContentfulPaint": [918, 916, 1069, ...],
    ...
  }
}
```

---

## 9. CI/CD — Lighthouse CI Workflow

**File:** `.github/workflows/lighthouse-ci.yml`

The workflow is **manually triggered** (`workflow_dispatch`) to give full control over each benchmark run. It accepts the following inputs:

| Input               | Default     | Options                              | Description                                       |
| ------------------- | ----------- | ------------------------------------ | ------------------------------------------------- |
| `project`           | `mfe`       | `mfe`, `monolith`                    | Which architecture to benchmark                   |
| `mode`              | `cold`      | `cold`, `warm`, `both`               | Cache state for Lighthouse                        |
| `network`           | `none`      | `none`, `4g`, `3g`, `all`            | Network throttling profile                        |
| `optimization`      | `optimized` | `optimized`, `non-optimized`, `both` | MFE lazy-loading/shared dep variant               |
| `url`               | —           | —                                    | Custom base URL (overrides default EC2 URL)       |
| `optimized_url`     | —           | —                                    | Specific URL for the optimized MFE deployment     |
| `non_optimized_url` | —           | —                                    | Specific URL for the non-optimized MFE deployment |
| `page`              | `all`       | `all`, `home`, `login`, `dashboard`  | Single page or all pages                          |

The default benchmark target is `http://13.229.66.196` (EC2 instance).

### Parallel Strategy

The workflow uses a GitHub Actions matrix strategy that fans out by `(page × network × optimization)`, running all combinations in parallel to minimize total wall-clock time. After all Lighthouse jobs complete, a corresponding set of aggregation jobs merges and summarizes the results before a final combine-and-publish job commits the data to the repository.

---

## 10. Infrastructure & Deployment

### Amazon EC2

Both the **optimized MFE** and the **monolith** production applications are hosted on Amazon EC2 instances running Docker containers behind Nginx reverse proxies.

Each application is containerized using a multi-stage Docker build:

```
Stage 1 (deps): node:lts-alpine
  - Install Bun globally
  - Copy package.json + bun.lock
  - bun install

Stage 2 (runner): node:lts-alpine
  - Copy node_modules from stage 1
  - Copy full project source
  - NODE_ENV=production
  - bun run mfe:build  (or monolith:build)
  - CMD: bun run mfe:start
```

Nginx acts as a reverse proxy on port 80, forwarding requests to the Next.js application on port 3000.

### Cloudflare R2

MFE remote bundles (`remoteEntry.js` and associated chunks) for each remote application (`homeremote`, `loginremote`, `dashboardremote`, `supportremote`) are hosted on **Cloudflare R2** object storage. This simulates a realistic CDN-hosted microfrontend deployment where remotes are served from a globally distributed edge network rather than the same origin as the host.

The host application references these remote URLs via the environment variables (`NX_PUBLIC_HOME_REMOTE`, etc.) set at build time or injected at runtime.

### Docker Compose

| Compose file                               | Purpose                                        |
| ------------------------------------------ | ---------------------------------------------- |
| `docker/compose/mfe-web-app.dev.yml`       | MFE development with live-reload volume mounts |
| `docker/compose/mfe-web-app.prod.yml`      | MFE production (Next.js + Nginx)               |
| `docker/compose/monolith-web-app.prod.yml` | Monolith production                            |

---

## 11. Running the Project

### Prerequisites

- [Node.js](https://nodejs.org/) LTS
- [Bun](https://bun.sh/) (latest)
- [Docker](https://docker.com/) + Docker Compose (for containerized runs)
- Chrome/Chromium (for Lighthouse CI local runs)

### Install Dependencies

```bash
# From monorepo root
bun install
```

### Development — Monolith

```bash
# Start in development mode
npm run monolith:dev
# or
nx dev monolith-web-app
```

### Development — MFE

The MFE requires all remotes to be running simultaneously. Each remote must be started before the host shell can load them.

```bash
# Start host shell
npm run mfe:dev

# In separate terminals, start each remote
nx serve homeremote
nx serve loginremote
nx serve dashboardremote
nx serve supportremote
```

### Production — Docker Compose

```bash
# MFE (production build + Nginx)
npm run mfe:up

# Monolith
npm run monolith:up
```

### Benchmark Visualizer

```bash
npm run visualizer:dev
# Opens at http://localhost:4300
```

### Automated Screenshots

```bash
cd tools/benchmark-screenshots
npm run capture:install   # First time only
npm run capture:all       # Takes all screenshots
```

### Running Lighthouse Locally

```bash
cd tools/web-vitals-benchmark
bun install

# Against local apps
bun run lighthouse:local

# Against a custom URL (cold start)
NX_BENCHMARK_URL=http://localhost:3000 bun run lighthouse:cold
```

---

## 12. Architecture Deep Dive

### 12.1 Microfrontend Architecture

```
Browser
  │
  ▼
Nginx (port 80)
  │ reverse proxy
  ▼
Next.js Shell — mfe-web-app (port 3000)
  │
  │ On route /  ──── runtime fetch ──▶  homeremote/remoteEntry.js (R2/CDN)
  │                                       └── loads homeremote/Module
  │                                             └── renders <HomeModule /> from @mfe-benchmark/home-module
  │
  │ On route /login ── runtime fetch ──▶  loginremote/remoteEntry.js (R2/CDN)
  │                                         └── loads loginremote/Module
  │                                               └── renders <LoginModule />
  │
  └── On route /dashboard ─ runtime fetch ──▶  dashboardremote/remoteEntry.js (R2/CDN)
                                                  └── loads dashboardremote/Module
                                                        └── renders <DashboardModule />
```

#### Module Federation Initialization Flow

1. User navigates to a route.
2. `useMultipleModuleFederation` hook is invoked.
3. `createInstance()` from `@module-federation/enhanced/runtime` initializes the MF host.
4. The hook calls `loadRemote(moduleName)` for each required remote.
5. The browser fetches `remoteEntry.js` from the configured CDN URL.
6. The remote's module graph is evaluated; shared dependencies (React, Zustand) are resolved from the host's scope if already loaded, avoiding duplicate instances.
7. The React component is returned and rendered via `RemoteModuleRenderer`.

#### Shared Dependencies

The `NX_OPTIMIZE_MFE` environment variable controls two distinct sharing strategies for the remotes:

| Strategy          | `NX_OPTIMIZE_MFE` | Behavior                                                                                                                                                                                                                                               |
| ----------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Non-optimized** | `false` / unset   | Only `react` and `react-dom` are shared as singletons. All other deps are bundled independently per remote.                                                                                                                                            |
| **Optimized**     | `true`            | All dependencies present in the root `package.json` are shared. Singletons are enforced for `react`, `react-dom`, `react-router-dom`, `zustand`. Version requirements are specified; strict version enforcement is disabled to allow minor mismatches. |

The optimized variant significantly reduces network payload because dependencies like Tailwind CSS utility classes, Recharts, and other heavy libraries are loaded once from the host and reused across all remotes.

### 12.2 Monolith Architecture

```
Browser
  │
  ▼
Nginx (port 80)
  │ reverse proxy
  ▼
Next.js Monolith — monolith-web-app (port 3000)
  │
  ├── /        ──── dynamic import ──▶  @mfe-benchmark/home-module (bundled at build time)
  ├── /login   ──── dynamic import ──▶  @mfe-benchmark/login-module (bundled)
  └── /dashboard ── dynamic import ──▶  @mfe-benchmark/dashboard-module + support-module (bundled)
```

All page modules are resolved by Nx TypeScript path aliases at compile time and bundled into the Next.js application's JavaScript chunks. There is no runtime network request to load UI code — it is all part of the same deployment artifact.

### 12.3 Optimization Variants (MFE)

Two distinct MFE builds are benchmarked to understand the impact of Module Federation sharing strategies:

| Variant               | Deployed At       | Sharing Strategy                                            |
| --------------------- | ----------------- | ----------------------------------------------------------- |
| **Optimized MFE**     | Primary EC2 URL   | All `package.json` deps shared; React/Zustand as singletons |
| **Non-Optimized MFE** | Secondary EC2 URL | Only React/react-dom shared; all others bundled per remote  |

This allows the study to quantify the performance benefit of aggressive dependency sharing in Module Federation.

---

## 13. Benchmark Dimensions

Each benchmark run is characterized by four independent dimensions:

| Dimension       | Values                                                                            |
| --------------- | --------------------------------------------------------------------------------- |
| **Project**     | `mfe` (optimized), `mfe` (non-optimized), `monolith`                              |
| **Page**        | `home` (`/`), `login` (`/login`), `dashboard` (`/dashboard`)                      |
| **Cache State** | `cold` (no cache), `warm` (primed cache)                                          |
| **Network**     | `none` (no throttle), `4G LTE` (rttMs=150, 1638 kbps), `3G` (rttMs=300, 700 kbps) |

### Cold vs. Warm Start

|                       | Cold Start                          | Warm Start                                         |
| --------------------- | ----------------------------------- | -------------------------------------------------- |
| **Config**            | `disableStorageReset: false`        | `disableStorageReset: true`                        |
| **Cache cleared**     | Before every run                    | Cache preserved between navigations                |
| **Simulates**         | First-ever visit (no browser cache) | Returning visitor (assets cached)                  |
| **Lighthouse visits** | URL once                            | URL twice (first primes cache, second is measured) |
| **Runs**              | 30                                  | 30                                                 |

### Network Throttling Profiles

Both profiles use `cpuSlowdownMultiplier: 4` to simulate a mid-range mobile device CPU alongside network degradation:

| Profile | RTT    | Download    | Upload   |
| ------- | ------ | ----------- | -------- |
| 4G LTE  | 150 ms | 1638.4 kbps | 675 kbps |
| 3G      | 300 ms | 700 kbps    | 700 kbps |

---

## 14. Statistical Analysis

### Descriptive Statistics

For each metric across 30 runs, the following statistics are computed:

| Statistic | Description                      |
| --------- | -------------------------------- |
| Mean      | Arithmetic average               |
| Median    | 50th percentile                  |
| Mode      | Most frequent value              |
| Min       | Minimum observed value           |
| Max       | Maximum observed value           |
| Q1        | 25th percentile (lower quartile) |
| Q3        | 75th percentile (upper quartile) |

### Welch's Two-Sample t-Test

The visualizer implements a full **Welch's t-test** (unequal variance t-test) to determine whether the performance difference between MFE and monolith for any given metric is statistically significant. Welch's t-test is appropriate here because:

- Sample sizes are equal (both 30 runs) but variances may differ.
- It does not assume equal population variances.
- It is more robust than Student's t-test for real-world performance data.

The implementation uses:

- **Lanczos approximation** for the log-gamma function.
- **Lentz's continued fraction algorithm** for the regularized incomplete beta function.
- These allow computation of the t-distribution CDF (and thus the p-value) entirely in JavaScript without external statistical libraries.

Results show:

- `tStatistic` — the computed t-value
- `pValue` — two-tailed p-value
- `degreesOfFreedom` — Welch–Satterthwaite approximation
- `significant` — boolean: `true` if `p < 0.05`
- `meanDifference` — absolute difference in means

**Lower is better** for all six metrics. When the t-test is significant, the architecture with the lower mean is declared the winner for that metric/scenario combination.

---

## 15. Data Storage Layout

Benchmark result data is committed to the repository under:

```
tools/benchmark-visualizer/public/data/
├── manifest.json                           # Lists available pages
├── mfe/
│   ├── home/
│   │   ├── cold/
│   │   │   ├── none/
│   │   │   │   ├── optimized/
│   │   │   │   │   └── summary.json
│   │   │   │   └── non-optimized/
│   │   │   │       └── summary.json
│   │   │   ├── 4g/
│   │   │   │   ├── optimized/summary.json
│   │   │   │   └── non-optimized/summary.json
│   │   │   └── 3g/
│   │   │       ├── optimized/summary.json
│   │   │       └── non-optimized/summary.json
│   │   └── warm/
│   │       └── (same structure)
│   ├── login/
│   │   └── (same structure)
│   └── dashboard/
│       └── (same structure)
└── monolith/
    ├── home/
    │   ├── cold/none/default/summary.json
    │   └── warm/none/default/summary.json
    ├── login/
    │   └── (same structure)
    └── dashboard/
        └── (same structure)
```

Each `summary.json` contains:

- `reportVersion` — schema version (`"2.0"`)
- `lighthouseResults` — array of per-run metric values (30 entries)
- `benchmarkSummary` — per-metric descriptive statistics object
- `benchmarkTTestTable` — per-metric arrays of raw values for t-test computation

---

## 16. Research Reproducibility

The design of this project prioritizes reproducibility:

1. **Identical UI code** — both apps render the exact same React components from `libs/modules`, ensuring content equivalence.
2. **Controlled cache states** — explicit cold/warm configurations eliminate caching ambiguity.
3. **30-run samples** — large enough sample size for meaningful statistical analysis.
4. **Versioned results** — all `summary.json` files are committed to the Git repository with CI-generated commit messages including the benchmark parameters (project, mode, network, optimization).
5. **Network simulation** — Lighthouse's built-in throttling provides consistent and repeatable network conditions regardless of the runner's actual network.
6. **Headless Chrome** — all runs use `--headless=new --no-sandbox --disable-gpu` flags for a consistent browser environment.
7. **Single-instance CI runners** — benchmarks run on `ubuntu-latest` GitHub Actions runners to minimize environment variability.
8. **Statistical significance testing** — Welch's t-test at p < 0.05 distinguishes meaningful differences from measurement noise.
9. **Parametric CI inputs** — the entire benchmark matrix (project, mode, network, optimization, page, URLs) is controlled via workflow dispatch inputs, enabling exact reproduction of any prior run.

---

## 17. Annotated Code Reference

This section walks through the most important code in the project with line-by-line explanations.

---

### 17.1 GitHub Actions — `lighthouse-ci.yml`

#### Setup Job: Building the Parallel Matrix

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      page-matrix: ${{ steps.set-pages.outputs.matrix }}
      network-matrix: ${{ steps.set-networks.outputs.matrix }}
      optimization-matrix: ${{ steps.set-optimizations.outputs.matrix }}
    steps:
      - name: Determine page matrix
        id: set-pages
        run: |
          PAGE="${{ inputs.page || 'all' }}"
          if [ "$PAGE" = "all" ]; then
            echo 'matrix=[{"name":"home","path":"/"},{"name":"login","path":"/login"},{"name":"dashboard","path":"/dashboard"}]' >> "$GITHUB_OUTPUT"
          elif [ "$PAGE" = "home" ]; then
            echo 'matrix=[{"name":"home","path":"/"}]' >> "$GITHUB_OUTPUT"
          fi

      - name: Determine optimization matrix
        id: set-optimizations
        run: |
          PROJECT="${{ inputs.project || 'mfe' }}"
          OPTIMIZATION="${{ inputs.optimization || 'optimized' }}"
          if [ "$PROJECT" = "monolith" ]; then
            echo 'matrix=["default"]' >> "$GITHUB_OUTPUT"
          elif [ "$OPTIMIZATION" = "both" ]; then
            echo 'matrix=["optimized","non-optimized"]' >> "$GITHUB_OUTPUT"
          else
            echo "matrix=[\"${OPTIMIZATION}\"]" >> "$GITHUB_OUTPUT"
          fi
```

**What this does:**

The `setup` job runs first and constructs three JSON arrays that become the axes of the parallel matrix used by the `lighthouse` job. This is a GitHub Actions pattern called a dynamic matrix strategy.

- `page-matrix` — a JSON array of objects, each carrying both a human-readable `name` (used for artifact naming) and the actual URL `path`. When `page=all`, all three pages are included; otherwise only the selected one.
- `network-matrix` — a simple JSON array of throttling profile strings (`["none"]`, `["4g"]`, `["3g"]`, or `["none","4g","3g"]` when `all`).
- `optimization-matrix` — for monolith projects, this is always `["default"]` because there is no optimization concept. For MFE, it outputs `["optimized"]`, `["non-optimized"]`, or both depending on the input.

These outputs are then consumed by downstream jobs via `${{ fromJSON(needs.setup.outputs.page-matrix) }}`.

---

#### Lighthouse Job: Running Measurements

```yaml
lighthouse:
  runs-on: ubuntu-latest
  needs: setup
  strategy:
    matrix:
      instance: [1]
      page: ${{ fromJSON(needs.setup.outputs.page-matrix) }}
      network: ${{ fromJSON(needs.setup.outputs.network-matrix) }}
      optimization: ${{ fromJSON(needs.setup.outputs.optimization-matrix) }}

  steps:
    - name: Set benchmark URL
      id: set-url
      run: |
        OPTIMIZATION="${{ matrix.optimization }}"
        if [ "$OPTIMIZATION" = "non-optimized" ] && [ -n "${{ inputs.non_optimized_url }}" ]; then
          BASE_URL="${{ inputs.non_optimized_url }}"
        elif [ "$OPTIMIZATION" = "optimized" ] && [ -n "${{ inputs.optimized_url }}" ]; then
          BASE_URL="${{ inputs.optimized_url }}"
        elif [ -n "${{ inputs.url }}" ]; then
          BASE_URL="${{ inputs.url }}"
        else
          BASE_URL="${{ env.DEFAULT_BENCHMARK_URL }}"
        fi
        PAGE_PATH="${{ matrix.page.path }}"
        BASE_URL="${BASE_URL%/}"
        FULL_URL="${BASE_URL}${PAGE_PATH}"
        echo "url=${FULL_URL}" >> "$GITHUB_OUTPUT"

    - name: Run Lighthouse CI
      working-directory: tools/web-vitals-benchmark
      env:
        NX_BENCHMARK_URL: ${{ steps.set-url.outputs.url }}
      run: |
        if [ "${{ matrix.network }}" != "none" ]; then
          export NX_NETWORK_PROFILE="${{ matrix.network }}"
        fi
        if [ "$MODE" = "both" ]; then
          bun run lighthouse:cold || true
          mkdir -p .lighthouseci-cold && cp .lighthouseci/* .lighthouseci-cold/ && rm -rf .lighthouseci
          bun run lighthouse:warm || true
          mkdir -p .lighthouseci-warm && cp .lighthouseci/* .lighthouseci-warm/ && rm -rf .lighthouseci
        elif [ "$MODE" = "warm" ]; then
          bun run lighthouse:warm
        else
          bun run lighthouse:cold
        fi
      continue-on-error: true
```

**What this does:**

The matrix strategy causes this job to be instantiated once for every combination of `(page × network × optimization)`. Each instance runs independently and in parallel.

- **URL resolution:** The `set-url` step assembles the full URL that Lighthouse will audit. The logic checks if a specific URL was provided for the current optimization variant; if not it falls back to the generic `url` input, and finally to the default EC2 address. The page path (e.g., `/dashboard`) is appended. The `BASE_URL%/` shell expansion strips any trailing slash before concatenation to avoid double slashes.
- **Network injection:** `NX_NETWORK_PROFILE` is set as an environment variable so the Lighthouse config file (`lighthouserc.cold.cjs`) can read it and apply the correct throttling object to the Lighthouse settings.
- **Mode branching:** When mode is `both`, cold and warm runs execute sequentially within the same job step. After each run, results are moved to a mode-specific directory (`-cold` / `-warm`) before the shared `.lighthouseci/` directory is cleared, preventing results from bleeding across modes.
- **`continue-on-error: true`** — Lighthouse can fail with non-zero exit codes when performance assertions are not met. This flag ensures the workflow continues and uploads whatever results were collected even on assertion failures.

---

#### Aggregate and Publish Jobs

```yaml
aggregate-results:
  needs: [setup, lighthouse]
  strategy:
    matrix:
      page: ${{ fromJSON(needs.setup.outputs.page-matrix) }}
      network: ${{ fromJSON(needs.setup.outputs.network-matrix) }}
      optimization: ${{ fromJSON(needs.setup.outputs.optimization-matrix) }}
  steps:
    - name: Download artifacts
      uses: actions/download-artifact@v4
      with:
        pattern: lighthouse-results__${{ matrix.page.name }}__${{ matrix.network }}__${{ matrix.optimization }}__*
        path: lighthouse-artifacts

    - name: Merge and summarize
      run: |
        find ../../lighthouse-artifacts -name "*.json" -exec cp {} merged-results/ \;
        cp merged-results/lhr-*.json .lighthouseci/
        bun run dev > merged-results/summary.json

publish-to-visualizer:
  needs: [combine-results, combine-all-results]
  permissions:
    contents: write
  steps:
    - name: Commit and push benchmark data
      run: |
        git config user.name "github-actions[bot]"
        git add tools/benchmark-visualizer/public/data/
        if git diff --cached --quiet; then
          echo "No changes to commit."
        else
          git commit -m "chore: update benchmark data ... [skip ci]"
          git push
        fi
```

**What this does:**

- **`aggregate-results`** fans out over the same matrix. It downloads all artifacts whose names match the pattern for its specific `(page × network × optimization)` combination — the wildcard `__*` at the end captures all instances (future-proofing for running multiple instances in parallel). It then merges all `lhr-*.json` raw Lighthouse reports, copies them into `.lighthouseci/`, and runs `bun run dev` which executes `index.ts`. The script's JSON output is redirected directly to `summary.json`.

- **`publish-to-visualizer`** is the final job. After downloading the fully organized `combined-results` artifact, it copies it into `tools/benchmark-visualizer/public/data/` and commits the changes back to the repository using the `github-actions[bot]` identity. The `[skip ci]` tag in the commit message prevents the push from recursively triggering another CI run.

---

### 17.2 `web-vitals-benchmark` — Core Code

#### `lighthouserc.cold.cjs` — Cold Start Configuration

```js
const benchmarkUrl = process.env.NX_BENCHMARK_URL;
const networkProfile = process.env.NX_NETWORK_PROFILE;

const NETWORK_PROFILES = {
  '4g': {
    rttMs: 150,
    throughputKbps: 1638.4,
    uploadThroughputKbps: 675,
    downloadThroughputKbps: 1638.4,
    cpuSlowdownMultiplier: 4,
  },
  '3g': {
    rttMs: 300,
    throughputKbps: 700,
    uploadThroughputKbps: 700,
    downloadThroughputKbps: 700,
    cpuSlowdownMultiplier: 4,
  },
};

module.exports = {
  ci: {
    collect: {
      url: [benchmarkUrl],
      numberOfRuns: 30,
      settings: {
        preset: 'desktop',
        chromeFlags: '--no-sandbox --disable-dev-shm-usage --disable-gpu --headless=new',
        disableStorageReset: false, // ← Cold start: wipe cache every run
        ...(networkProfile && {
          throttling: NETWORK_PROFILES[networkProfile],
          throttlingMethod: 'simulate',
        }),
      },
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
      },
    },
    upload: { target: 'temporary-public-storage' },
  },
};
```

**What this does:**

- `NX_BENCHMARK_URL` is consumed from the environment, which the CI sets via the `set-url` step. This makes the same config file reusable for any page or deployment.
- `numberOfRuns: 30` — Lighthouse CI will launch Chrome and audit the URL 30 consecutive times. Each produces a separate `lhr-{timestamp}.json` file in `.lighthouseci/`.
- `disableStorageReset: false` — before each of the 30 runs, Lighthouse clears all browser storage (cookies, localStorage, HTTP cache). This simulates a first-time visitor on every run — the **cold start** scenario.
- `chromeFlags` — `--headless=new` uses the modern headless Chrome mode, `--no-sandbox` and `--disable-dev-shm-usage` are required inside Linux containers (GitHub Actions runners), and `--disable-gpu` prevents GPU process crashes in headless environments.
- The `throttling` block is conditionally spread into `settings` only when `NX_NETWORK_PROFILE` is set. The `throttlingMethod: 'simulate'` tells Lighthouse to simulate network conditions during the audit rather than using packet-level throttling (DevTools throttling), which is more reproducible in CI.
- The `assert` section causes `lhci autorun` to exit with a non-zero code when performance score drops below 80%. This is why the CI step uses `continue-on-error: true`.

The **warm start** config (`lighthouserc.warm.cjs`) differs in exactly two ways:

- `disableStorageReset: true` — cache is preserved between navigations.
- `url: [benchmarkUrl, benchmarkUrl]` — the URL is listed twice. The first visit primes the cache; only the second visit is the actual measured warm-start load.

---

#### `index.ts` — Aggregation Entry Point

```ts
import { Glob } from 'bun';
import getCoreData from './src/getCoreData';
import { getBenchmarkSummary, getBenchmarkTTestTable } from './src/getBenchmarkSummaries';

const readFiles = async (dir: string, prefix = 'lhr-') => {
  const glob = new Glob('*.{json}');
  const scannedFiles = await Array.fromAsync(glob.scan({ cwd: dir }));
  const filteredFiles = scannedFiles.filter((file) => file.includes(prefix));

  const results: BenchmarkResult[] = [];
  for (const file of filteredFiles) {
    const content = await Bun.file(`${dir}/${file}`).text();
    const json = JSON.parse(content);
    results.push(getCoreData(json));
  }
  return results;
};

const lighthouseResults = await readFiles('./.lighthouseci');
const benchmarkSummary = getBenchmarkSummary(lighthouseResults);
const benchmarkTTestTable = getBenchmarkTTestTable(lighthouseResults);

console.log(
  JSON.stringify(
    {
      reportVersion: '2.0',
      lighthouseResults,
      benchmarkSummary,
      benchmarkTTestTable,
    },
    null,
    2
  )
);
```

**What this does:**

- Bun's native `Glob` API scans the `.lighthouseci/` directory for all `lhr-*.json` files — the raw Lighthouse report files. The `prefix` filter ensures only Lighthouse result files are processed and any other JSON files (like Lighthouse CI manifests) are excluded.
- Each file is read with `Bun.file(...).text()` (Bun's fast native file API), parsed as JSON, and passed through `getCoreData()` to extract only the six relevant metrics.
- The resulting `BenchmarkResult[]` array is passed to both aggregation functions.
- Output is written to `console.log` as clean JSON (no ANSI color codes). In CI, this stdout is redirected to `summary.json` via `bun run dev > merged-results/summary.json`.

---

#### `getCoreData.ts` — Metric Extraction

```ts
export const getCoreData = (lighthouseResult: any): BenchmarkResult => {
  return {
    speedIndex: lighthouseResult.audits['speed-index'].numericValue,
    firstContentfulPaint: lighthouseResult.audits['first-contentful-paint'].numericValue,
    largestContentfulPaint: lighthouseResult.audits['largest-contentful-paint'].numericValue,
    cumulativeLayoutShift: lighthouseResult.audits['cumulative-layout-shift'].numericValue,
    timeToInteractive: lighthouseResult.audits['interactive'].numericValue,
    totalBlockingTime: lighthouseResult.audits['total-blocking-time'].numericValue,
  };
};
```

**What this does:**

A Lighthouse report JSON is a large object (~10 MB) containing hundreds of audit results. This function acts as a projection — it discards everything except the six metrics needed for statistical analysis. Each metric is accessed from `audits[key].numericValue`, which is the raw numeric value before Lighthouse applies display formatting.

---

#### `getBenchmarkSummaries.ts` — Statistical Aggregation

```ts
export const getBenchmarkSummary = (results: BenchmarkResult[]): BenchmarkSummary => {
  const summary: BenchmarkSummary = { ...defaultEmptySummary };

  for (const metric of BENCHMARK_METRICS) {
    const values = results.map((result) => result[metric]).filter((v): v is number => v != null && !Number.isNaN(v)); // ← guard against missing audits

    summary[metric] = {
      mean: calculateMean(values),
      median: calculateMedian(values),
      mode: calculateMode(values),
      min: calculateMin(values),
      max: calculateMax(values),
      q1: calculateQuartile(values, 0.25),
      q3: calculateQuartile(values, 0.75),
    };
  }
  return summary;
};

export const getBenchmarkTTestTable = (results: BenchmarkResult[]): TTestTable => {
  const table = {} as TTestTable;
  for (const metric of BENCHMARK_METRICS) {
    table[metric] = results.map((result) => result[metric]); // ← raw array, not summarized
  }
  return table;
};
```

**What this does:**

- `getBenchmarkSummary` iterates over the six metric keys. For each one, it collects all values from the 30 runs into a flat array, filters out `null`/`NaN` (some Lighthouse audits can return `undefined` when a metric cannot be computed, e.g., Speed Index on very fast pages), and computes the full descriptive statistics.
- Quartiles use a linear interpolation formula: `sorted[base] + rest * (sorted[base+1] - sorted[base])`, which is the standard method used by numpy and most statistical software.
- `getBenchmarkTTestTable` is deliberately simpler — it keeps the **raw per-run values** as arrays rather than summarizing them. This is the data consumed by the t-test in the visualizer; you cannot perform a t-test on summary statistics, you need the original sample observations.

---

### 17.3 `benchmark-visualizer` — Core Code

#### `dataLoader.ts` — Manifest-Driven Data Fetching

```ts
export async function loadManifest(): Promise<PageManifest> {
  const response = await fetch('/data/manifest.json');
  if (!response.ok) return { pages: [] };
  return await response.json();
}

export async function loadBenchmarkData(project: ProjectType, page: string, scenario: ScenarioType, network: NetworkProfile = 'none', optimization: OptimizationType = 'optimized'): Promise<SummaryJson | null> {
  const opt = project === 'monolith' ? 'default' : optimization;
  const response = await fetch(`/data/${project}/${page}/${scenario}/${network}/${opt}/summary.json`);
  if (!response.ok) return null;
  const data: SummaryJson = await response.json();
  if (!data.lighthouseResults || data.lighthouseResults.length === 0) return null;
  return data;
}

export async function loadAllPagesData(pages: PageInfo[], network: NetworkProfile, optimization: OptimizationType): Promise<Record<string, PageBenchmarkData>> {
  const entries = await Promise.all(
    pages.map(async (p) => {
      const [mfeWarm, mfeCold, monolithWarm, monolithCold] = await Promise.all([loadBenchmarkData('mfe', p.id, 'warm', network, optimization), loadBenchmarkData('mfe', p.id, 'cold', network, optimization), loadBenchmarkData('monolith', p.id, 'warm', network), loadBenchmarkData('monolith', p.id, 'cold', network)]);
      return [p.id, { mfeWarm, mfeCold, monolithWarm, monolithCold }] as const;
    })
  );
  return Object.fromEntries(entries);
}
```

**What this does:**

- `loadManifest` fetches `manifest.json` which tells the app which pages are available. This makes the visualizer extensible — adding a new page to the benchmark only requires adding its entry to `manifest.json`; no code changes in the visualizer are needed.
- `loadBenchmarkData` constructs the URL path from the five dimensions (`project/page/scenario/network/optimization`) and fetches `summary.json`. The `opt` override forces monolith data to always use the `default` path segment regardless of the optimization selector, since the monolith has no optimization variants.
- `loadAllPagesData` uses nested `Promise.all` to fetch all eight combinations (4 pages × 2 scenarios) in parallel, minimizing loading time. The outer `Promise.all` runs all pages concurrently; the inner `Promise.all` for each page runs both scenarios and both projects concurrently.

---

#### `ttest.ts` — Welch's t-Test Implementation

```ts
export function welchTTest(sample1: number[], sample2: number[]): TTestResult {
  const n1 = sample1.length;
  const n2 = sample2.length;
  const m1 = mean(sample1);
  const m2 = mean(sample2);
  const v1 = variance(sample1); // sample variance (divided by n-1)
  const v2 = variance(sample2);

  const se1 = v1 / n1; // squared standard error of mean 1
  const se2 = v2 / n2; // squared standard error of mean 2
  const seSum = se1 + se2;

  // t-statistic: difference in means divided by pooled standard error
  const t = (m1 - m2) / Math.sqrt(seSum);

  // Welch-Satterthwaite degrees of freedom approximation
  const df = seSum ** 2 / (se1 ** 2 / (n1 - 1) + se2 ** 2 / (n2 - 1));

  // Two-tailed p-value from the t-distribution CDF
  const pValue = 2 * (1 - tCDF(Math.abs(t), df));

  return {
    tStatistic: t,
    pValue,
    degreesOfFreedom: df,
    significant: pValue < 0.05, // α = 0.05 significance level
    meanDifference: m1 - m2,
  };
}
```

The CDF of the t-distribution is computed using the regularized incomplete beta function:

```ts
function tCDF(t: number, df: number): number {
  const x = df / (df + t * t);
  const ib = incompleteBeta(x, df / 2, 0.5); // I_x(df/2, 1/2)
  return t >= 0 ? 1 - 0.5 * ib : 0.5 * ib;
}
```

**What this does:**

The Welch's t-test is the correct statistical test for comparing two independent samples that may have different variances — exactly the situation here (MFE vs. monolith, same n=30 but different performance characteristics).

- **t-statistic:** Measures how many standard errors apart the two sample means are. A large absolute value means the means are far apart relative to the spread of the data.
- **Welch-Satterthwaite df:** Unlike Student's t-test which assumes a simple integer degrees of freedom, the Welch version computes a real-valued `df` that accounts for the difference in variance between the two samples. A smaller effective df means less certainty.
- **p-value:** The probability of observing a t-statistic this extreme or more extreme if the null hypothesis (no difference between the architectures) were true. `p < 0.05` means there is less than a 5% chance the observed difference is due to random measurement noise.
- **No external library:** The `incompleteBeta` function is implemented using Lentz's continued fraction algorithm, and `lgamma` uses the Lanczos approximation. Both are standard numerical methods that allow the entire statistical computation to run in the browser with no dependencies.

---

### 17.4 `benchmark-screenshots` — Core Code

#### `capture-pages.ts` — Full-Page Automated Screenshot Loop

```ts
async function main(): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }, // desktop viewport
  });
  const page = await context.newPage();

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await waitForLoad(page);

  // Loop: network → optimization (triggers data reload) → page → tab (client-side only)
  for (const network of NETWORKS) {
    await page.getByRole('button', { name: network.label, exact: true }).click();
    await waitForDataReload(page);

    for (const optimization of OPTIMIZATIONS) {
      await page.getByRole('button', { name: optimization.label, exact: true }).click();
      await waitForDataReload(page);

      for (const pg of PAGES) {
        await page.getByRole('button', { name: pg.label, exact: true }).click();
        await page.waitForTimeout(200); // client-side state update only — no fetch

        for (const tab of TABS) {
          await page.locator('nav.w-fit').getByRole('button', { name: tab.label, exact: true }).click();
          await waitForTabContent(page, tab.waitHeading);

          await scrollToTriggerRenders(page); // force lazy SVG paint

          const outputPath = buildPageOutputPath(pg.dir, network.dir, optimization.dir, tab.dir);
          mkdirSync(dirname(outputPath), { recursive: true });
          await page.screenshot({ path: outputPath, fullPage: true });
        }
      }
    }
  }
  await browser.close();
}
```

The scroll helper that forces chart renders:

```ts
async function scrollToTriggerRenders(page: Page): Promise<void> {
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  const step = 600;

  for (let y = step; y < scrollHeight; y += step) {
    await page.evaluate((scrollY: number) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(120); // wait for React to re-render visible charts
  }
  await page.waitForTimeout(400); // settle at bottom
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600); // final paint settle before screenshot
}
```

**What this does:**

- The outer loop structure is ordered deliberately: **network and optimization changes trigger data reloads** (the visualizer re-fetches all `summary.json` files and shows a spinner), while **page and tab changes are purely client-side** (they only update `activePage`/`activeTab` state with no network request). The loop nesting minimizes the number of expensive data reloads.
- `waitForDataReload` detects when the app's loading spinner appears (triggered by the selector click causing `setLoading(true)` in React state) and then waits for it to disappear again.
- `scrollToTriggerRenders` solves a fundamental Recharts problem: `ResponsiveContainer` measures its own dimensions only when visible in the viewport. Charts that are below the fold start with zero dimensions. By scrolling through the full page before taking the screenshot, every chart is forced into the viewport at least once, causing it to measure itself and render at its correct size.
- `page.screenshot({ fullPage: true })` tells Playwright to capture the entire scrollable document height, not just the current viewport.
- The `waitForLoad` helper in `helpers.ts` polls the DOM for the absence of `.animate-spin` (loading spinner) and the presence of `nav.w-fit` (the tab navigation that only appears when data is loaded), which is more reliable than fixed timeouts.

---

### 17.5 Dockerfile — Multi-Stage Build

```dockerfile
# Stage 1: Install dependencies only (deps layer)
FROM docker.io/node:lts-alpine AS deps

RUN npm install -g bun
WORKDIR /usr/src/app
COPY package.json bun.lock ./
RUN bun install

# Stage 2: Production runner
FROM docker.io/node:lts-alpine AS runner
RUN npm install -g bun

WORKDIR /usr/src/app

# Copy only the installed node_modules from the deps stage
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Copy the entire repository source
COPY ./ ./

ENV NODE_ENV=production

# Build the specific app (Nx selects only what's needed via project graph)
RUN bun run mfe:build   # or: bun run monolith:build

# Start the Next.js production server
CMD ["bun", "run", "mfe:start"]
```

**What this does:**

- **Two-stage build** separates dependency installation from the final image. The `deps` stage is responsible only for running `bun install`, which produces `node_modules`. The `runner` stage copies those pre-built modules with `COPY --from=deps`, avoiding re-running `bun install` (and all its network downloads) during the application build step.
- This pattern reduces the final image size and speeds up subsequent builds by allowing Docker to cache the `deps` layer. If `package.json` and `bun.lock` haven't changed, Docker reuses the cached `node_modules` layer even when source files change.
- **Why `node:lts-alpine` and not `oven/bun`?** The Dockerfile comment explains: the official Bun base image (`oven/bun`) has permission issues and a different process model that cause problems with the Nx build system in this monorepo. Instead, Bun is installed on top of the well-tested Node Alpine image via `npm install -g bun`.
- `bun run mfe:build` maps to `nx build mfe-web-app` in the root `package.json`. Nx's project graph ensures only the MFE shell and its transitive dependencies are built, not the monolith or other apps.
- `NODE_ENV=production` is set before the build step so Next.js performs its production optimization pass (tree shaking, minification, static asset optimization) rather than generating a development build.

---

### 17.6 MFE — Runtime Module Loading

#### `useModuleFederation.ts` — Multi-Remote Hook

```ts
export function useMultipleModuleFederation<T = React.ComponentType>(options: UseModuleFederationOptions): { modules: Map<string, T>; loading: boolean; errors: Map<string, string> } {
  const [modules, setModules] = useState<Map<string, T>>(new Map());
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false); // ← prevents double-initialization in StrictMode

  useEffect(() => {
    const loadModules = async () => {
      if (initialized.current) return; // guard: run once per mount
      initialized.current = true;

      const shared = await getSharedDependencies();

      // 1. Initialize a single MF host instance with ALL remotes registered
      const hostInstance = await createInstance({
        name: options.hostName, // e.g. 'mfeWebApp'
        remotes: options.remotes, // array of { name, entry, moduleName }
        shared, // React as a singleton
      });

      // 2. Load all modules in parallel — Promise.all for concurrent fetching
      const modulePromises = options.remotes.map(async (remote) => {
        try {
          const module = await hostInstance.loadRemote<{ default: T }>(
            remote.moduleName // e.g. 'homeremote/Module'
          );
          return { moduleName: remote.moduleName, component: module?.default ?? null, error: null };
        } catch (err) {
          return { moduleName: remote.moduleName, component: null, error: err instanceof Error ? err.message : 'Failed to load' };
        }
      });

      const results = await Promise.all(modulePromises);

      // 3. Separate successes and failures into two Maps
      const newModules = new Map<string, T>();
      const newErrors = new Map<string, string>();
      results.forEach(({ moduleName, component, error }) => {
        if (component) newModules.set(moduleName, component);
        if (error) newErrors.set(moduleName, error);
      });

      setModules(newModules);
      setErrors(newErrors);
    };

    loadModules().finally(() => setLoading(false));
  }, [options.hostName]);

  return { modules, loading, errors };
}
```

**What this does:**

- `initialized.current` is a ref (not state) so its mutation does not trigger re-renders. It guards against React 18 Strict Mode, which deliberately mounts and unmounts components twice in development to surface side effects. Without this guard, two MF host instances would be created simultaneously, causing a race condition.
- `createInstance` from `@module-federation/enhanced/runtime` sets up the Module Federation container in JavaScript. It registers the remote endpoints so the runtime knows where to fetch each remote's `remoteEntry.js` manifest before loading any module.
- All remotes for the current page are loaded concurrently via `Promise.all`. For the Home page, `homeremote` and `supportremote` are fetched simultaneously rather than sequentially, halving the total network wait time.
- The separation into `modules` (successes) and `errors` (failures) Maps means the UI can render whichever remotes loaded successfully while displaying error states only for the ones that failed — a graceful degradation strategy.

---

#### `RemoteModuleRenderer.tsx` — Rendering Remote Components

```tsx
export function RemoteModuleRenderer({ component: RemoteComponent, loading, error, moduleName }: RemoteModuleRendererProps) {
  // ── Loading state ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
        <span className="ml-4 text-white text-lg">{moduleName ? `Loading ${moduleName}...` : 'Loading remote module...'}</span>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
        <h3 className="text-red-400 font-semibold mb-2">Failed to Load {moduleName}</h3>
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────
  if (!RemoteComponent) {
    return (
      <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4">
        <p className="text-yellow-300">Module not available</p>
      </div>
    );
  }

  // ── Success: render the remote component ──────────────────────────────
  return <RemoteComponent />;
}
```

**What this does:**

This component implements the "loading state machine" pattern for async React rendering. It handles four discrete states — loading, error, empty (no component), and success — each with a distinct UI response. This is important for user experience because remote loading involves a real network round-trip to fetch `remoteEntry.js` from Cloudflare R2, which takes a measurable amount of time especially on throttled networks.

The `animate-spin` spinner class from Tailwind is also the target that `benchmark-screenshots`' `waitForLoad` helper polls for — demonstrating how the UI and automation tooling are deliberately coordinated.

---

#### MFE Page — `pages/index.tsx`

```tsx
export function Index() {
  const remotes = useMultipleModuleFederation({
    hostName: 'mfeWebApp',
    remotes: [
      {
        name: 'homeremote',
        entry: process.env.NX_PUBLIC_HOME_REMOTE || 'http://localhost:4202/remoteEntry.js',
        moduleName: 'homeremote/Module',
      },
      {
        name: 'supportremote',
        entry: process.env.NX_PUBLIC_SUPPORT_REMOTE || 'http://localhost:4201/remoteEntry.js',
        moduleName: 'supportremote/Module',
      },
    ],
  });

  return (
    <>
      <RemoteModuleRenderer component={remotes.modules.get('homeremote/Module') || null} error={remotes.errors.get('homeremote/Module') || null} loading={remotes.loading} />
      <RemoteModuleRenderer component={remotes.modules.get('supportremote/Module') || null} error={remotes.errors.get('supportremote/Module') || null} loading={remotes.loading} />
    </>
  );
}
```

**What this does:**

The page component is entirely declarative — it just declares which remotes it needs and renders each one. `useMultipleModuleFederation` handles the entire lifecycle of fetching both remotes concurrently. The single `remotes.loading` flag gates both `RemoteModuleRenderer` instances simultaneously so both spinners appear and disappear together, rather than each remote having independent loading states.

The `entry` URLs use environment variables with localhost fallbacks. In production on EC2, these are set to the Cloudflare R2 CDN URLs; in local development they default to locally running remote servers.

---

### 17.7 Monolith — Page Loaders

```tsx
// monolith-web-app/src/pages/index.tsx
const HomeModule = dynamic(
  () => import('@mfe-benchmark/home-module').then((mod) => mod.HomeModule),
  { ssr: false } // ← client-side only, matches MFE rendering behavior
);

export function Index() {
  return <HomeModule />;
}
```

```tsx
// monolith-web-app/src/pages/dashboard.tsx
const DashboardModule = dynamic(() => import('@mfe-benchmark/dashboard-module').then((mod) => mod.DashboardModule), { ssr: false });

const SupportModule = dynamic(() => import('@mfe-benchmark/support-module').then((mod) => mod.SupportModule), { ssr: false });

export function Index() {
  return (
    <>
      <SupportModule />
      <DashboardModule />
    </>
  );
}
```

**What this does:**

Next.js `dynamic()` is the monolith's equivalent of the MFE's `useMultipleModuleFederation`. It code-splits the import so the module is not included in the initial JavaScript bundle but is instead loaded on-demand when the page renders.

The critical parameter is `{ ssr: false }`. Without it, Next.js would attempt to render the component on the server side, which would produce a different performance profile — the HTML would arrive pre-rendered, bypassing the client-side module loading step entirely. With `ssr: false`, both the monolith and MFE render their page content only on the client after the initial HTML document is delivered, making the performance measurements directly comparable.

The modules (`@mfe-benchmark/home-module`, etc.) resolve to `libs/modules/home-module/src/index.ts` via the Nx TypeScript path alias defined in `tsconfig.base.json`. At build time, Next.js bundles these directly into the application's JavaScript chunks — no network request to a remote CDN occurs.

---

### 17.8 Module Federation Config — `module-federation.config.ts`

```ts
// apps/microfrontend/remotes/homeremote/module-federation.config.ts

import { ModuleFederationConfig } from '@nx/webpack';
import { dependencies } from '../../../../package.json';

const singletonLibraries = new Set(['react', 'react-dom', 'react-router-dom', 'zustand']);

const config: ModuleFederationConfig = {
  name: 'homeremote',
  library: { name: 'homeremote', type: 'var' },

  exposes: {
    './Module': './src/remote-entry.ts', // ← the only public export of this remote
  },

  // Two strategies controlled by NX_OPTIMIZE_MFE environment variable:
  ...(process.env.NX_OPTIMIZE_MFE !== 'true'
    ? {
        // NON-OPTIMIZED: only React/react-dom are shared as singletons
        shared: (libraryName, defaultConfig) => {
          if (libraryName === 'react' || libraryName === 'react-dom') {
            return { ...defaultConfig, singleton: true };
          }
          return defaultConfig; // all other deps bundled separately per remote
        },
      }
    : {
        // OPTIMIZED: share every dep listed in the root package.json
        shared: (libraryName, defaultConfig) => {
          if (!(libraryName in dependencies)) {
            return false; // unknown dep → do not share (prevents conflicts)
          }
          return {
            ...defaultConfig,
            requiredVersion: dependencies[libraryName as keyof typeof dependencies],
            singleton: singletonLibraries.has(libraryName),
            strictVersion: false, // warn on mismatch but don't hard-fail
          };
        },
      }),
};

export default config;
```

**What this does:**

This is the heart of Module Federation's behavior and the primary driver of the benchmark's optimization dimension.

- **`name: 'homeremote'`** — the unique identifier for this remote in the MF runtime. The host registers this name when calling `createInstance` and uses it to route `loadRemote('homeremote/Module')` to the correct bundle.
- **`library: { type: 'var' }`** — exposes the remote's container as a global JavaScript variable on `window.homeremote`. This is the classic UMD-compatible Module Federation approach.
- **`exposes: { './Module': ... }`** — declares the public API of this remote. `./src/remote-entry.ts` simply re-exports the App component (`export { default } from './app/app'`). From the host's perspective, only `homeremote/Module` is accessible; internal implementation details of the remote are not exposed.
- **Non-optimized sharing strategy:** Only `react` and `react-dom` are declared as singletons. Every other dependency (Tailwind, Recharts, Zustand, etc.) is compiled and bundled independently into each remote's chunk. This means if `homeremote`, `dashboardremote`, and `supportremote` all use Recharts, three separate copies of the Recharts library are downloaded.
- **Optimized sharing strategy:** The `shared` function receives the name of every dependency Webpack encounters during the remote's compilation. For each one that exists in the root `package.json` (the authoritative version list), it is declared as a shared module with a required version. Webpack will check at runtime whether the host or another remote has already loaded that exact (or compatible) version, and if so, reuse it rather than loading a duplicate. `singleton: true` goes further for state-managing libraries (React, Zustand) — it enforces that only one instance ever exists in the page, even if version ranges differ. `strictVersion: false` downgrades version mismatch from a hard error to a console warning, allowing minor semver differences to proceed.
- **Performance impact:** The optimized strategy can eliminate several hundred kilobytes of duplicate JavaScript per page navigation by reusing shared modules across remotes. This is one of the key variables being measured in the benchmark.

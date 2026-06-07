export const BASE_URL = 'http://localhost:4300';
export const OUTPUT_DIR = 'screenshots';

// ── Page matrix ────────────────────────────────────────────────────────────

export interface PageConfig {
  /** Page id as used in the manifest / app state */
  id: string;
  /** Exact button label shown in the Header PageSelector */
  label: string;
  /** Directory name segment for output paths */
  dir: string;
}

export const PAGES: PageConfig[] = [
  { id: 'home', label: 'Home', dir: 'home' },
  { id: 'dashboard', label: 'Dashboard', dir: 'dashboard' },
  { id: 'login', label: 'Login', dir: 'login' },
];

// ── Network matrix ─────────────────────────────────────────────────────────

export interface NetworkConfig {
  /** Exact button label shown in the Network selector */
  label: string;
  /** Directory name segment for output paths */
  dir: string;
}

export const NETWORKS: NetworkConfig[] = [
  { label: 'No Throttling', dir: 'no-throttle' },
  { label: '4G LTE', dir: '4g-lte' },
  { label: '3G', dir: '3g' },
];

// ── Optimization matrix ────────────────────────────────────────────────────

export interface OptimizationConfig {
  /** Exact button label shown in the Optimization selector */
  label: string;
  /** Directory name segment for output paths */
  dir: string;
}

export const OPTIMIZATIONS: OptimizationConfig[] = [
  { label: 'Optimized', dir: 'optimized' },
  { label: 'Non-Optimized', dir: 'non-optimized' },
];

// ── Scenario (tab) matrix ──────────────────────────────────────────────────

export interface ScenarioConfig {
  /** Exact tab button label shown in the scenario tab nav */
  label: string;
  /** Directory name segment for output paths */
  dir: string;
}

export const SCENARIOS: ScenarioConfig[] = [
  { label: 'Warm Start', dir: 'warm' },
  { label: 'Cold Start', dir: 'cold' },
];

// ── Tab matrix (full-page capture) ─────────────────────────────────────────

export interface TabConfig {
  /** Exact tab button label shown in the scenario tab nav */
  label: string;
  /** Directory name segment for output paths */
  dir: string;
  /**
   * Text of the h2 heading that appears after the tab renders.
   * Used as the wait signal before taking the screenshot.
   */
  waitHeading: string;
}

export const TABS: TabConfig[] = [
  { label: 'Warm Start', dir: 'warm', waitHeading: 'Warm Start Benchmark' },
  { label: 'Cold Start', dir: 'cold', waitHeading: 'Cold Start Benchmark' },
  {
    label: 'Combined Overview',
    dir: 'combined',
    waitHeading: 'Combined Overview',
  },
];

// ── Section file names (section-based capture) ─────────────────────────────

/** Maps each screenshot section to its output filename */
export const SECTION_FILES = {
  benchmarkSection: 'benchmark-section.png',
  meanPerformance: 'mean-performance.png',
  distributionAnalysis: 'distribution-analysis.png',
  statisticalComparison: 'statistical-comparison.png',
} as const;

export type SectionKey = keyof typeof SECTION_FILES;

// ── Total screenshot counts ────────────────────────────────────────────────

/** Section-based capture: 3 pages × 3 networks × 2 opts × 2 scenarios × 4 sections */
export const TOTAL_SCREENSHOTS =
  PAGES.length *
  NETWORKS.length *
  OPTIMIZATIONS.length *
  SCENARIOS.length *
  Object.keys(SECTION_FILES).length;

/** Full-page capture: 3 pages × 3 networks × 2 opts × 3 tabs */
export const TOTAL_PAGE_SCREENSHOTS =
  PAGES.length * NETWORKS.length * OPTIMIZATIONS.length * TABS.length;

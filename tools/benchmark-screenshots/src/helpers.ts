import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { Page, Locator } from 'playwright';
import type { SectionKey } from './config';
import { SECTION_FILES, OUTPUT_DIR } from './config';

// ── Wait helpers ───────────────────────────────────────────────────────────

/**
 * Wait for the app to finish loading data.
 *
 * Works for both the initial page load and reloads triggered by network /
 * optimization changes.  The app shows a full-screen spinner (`animate-spin`)
 * while `loading === true` and replaces it with the full UI (including the
 * tab nav `nav.w-fit`) when done.
 */
export async function waitForLoad(page: Page): Promise<void> {
  await page.waitForFunction(
    () => {
      const spinner = document.querySelector('.animate-spin');
      const tabNav = document.querySelector('nav.w-fit');
      return spinner === null && tabNav !== null;
    },
    { timeout: 30_000, polling: 100 }
  );
}

/**
 * After clicking a network or optimization button, call this to wait for the
 * data reload cycle to complete.
 *
 * The click triggers `setLoading(true)` on the React side, which tears down
 * the tab nav and shows the spinner.  This helper waits for that teardown to
 * start (up to 2 s) so the subsequent `waitForLoad` doesn't see stale state.
 */
export async function waitForDataReload(page: Page): Promise<void> {
  // Give React a tick to process the click and set loading=true
  await page.waitForTimeout(150);
  // Wait for loading indicator to appear (nav.w-fit gone OR spinner visible)
  await page
    .waitForFunction(
      () => {
        const spinner = document.querySelector('.animate-spin');
        const tabNav = document.querySelector('nav.w-fit');
        return spinner !== null || tabNav === null;
      },
      { timeout: 2_000 }
    )
    .catch(() => {
      // Data may have loaded faster than we could detect — that's fine
    });
  await waitForLoad(page);
}

/**
 * After clicking a scenario tab, wait for the corresponding section heading
 * to appear in the DOM.
 */
export async function waitForScenario(
  page: Page,
  scenarioLabel: string
): Promise<void> {
  await page.waitForSelector(`h2:has-text("${scenarioLabel} Benchmark")`, {
    timeout: 10_000,
  });
}

// ── Section locators ───────────────────────────────────────────────────────

/**
 * Returns Playwright locators for each of the four screenshot sections inside
 * the currently visible ScenarioSection component.
 *
 * Selector notes:
 *  - benchmarkSection  : full `div.space-y-8` containing the `h2 … Benchmark`
 *    heading (ScenarioSection root).
 *  - meanPerformance   : `div.bg-surface-2.rounded-xl` whose h3 contains
 *    "Mean Performance Comparison" (ComparisonBarChart root).
 *  - distributionAnalysis : parent `div` of the h3 "Distribution Analysis"
 *    — wraps the heading + the 2×2 chart grid.
 *  - statisticalComparison : `div.bg-surface-2.rounded-xl` whose h3 contains
 *    "Statistical Comparison" (StatisticalTable root).
 */
export function getSectionLocators(page: Page): Record<SectionKey, Locator> {
  return {
    benchmarkSection: page
      .locator('div.space-y-8')
      .filter({ has: page.locator('h2', { hasText: 'Benchmark' }) })
      .first(),

    meanPerformance: page
      .locator('div.bg-surface-2.rounded-xl')
      .filter({
        has: page.locator('h3', { hasText: 'Mean Performance Comparison' }),
      })
      .first(),

    distributionAnalysis: page
      .locator('h3', { hasText: 'Distribution Analysis' })
      .locator('..'),

    statisticalComparison: page
      .locator('div.bg-surface-2.rounded-xl')
      .filter({
        has: page.locator('h3', { hasText: 'Statistical Comparison' }),
      })
      .first(),
  };
}

// ── Output path builder ────────────────────────────────────────────────────

export function buildOutputPath(
  outputRoot: string,
  pageDir: string,
  networkDir: string,
  optimizationDir: string,
  scenarioDir: string,
  section: SectionKey
): string {
  return `${outputRoot}/${pageDir}/${networkDir}/${optimizationDir}/${scenarioDir}/${SECTION_FILES[section]}`;
}

// ── Screenshot helper ──────────────────────────────────────────────────────

/**
 * Scroll an element into the viewport (ensures lazy-rendered charts are fully
 * painted), wait briefly for animation frames to settle, then take an element
 * screenshot saved to `outputPath`.
 *
 * Returns `true` on success, `false` if the element is not found (e.g. when
 * benchmark data is absent for that combination).
 */
export async function scrollAndCapture(
  element: Locator,
  outputPath: string
): Promise<boolean> {
  // Check element is present before attempting screenshot
  const count = await element.count();
  if (count === 0) {
    return false;
  }

  const page = element.page();
  mkdirSync(dirname(outputPath), { recursive: true });

  // Hide the sticky <header> so it doesn't overlay the element's bounding
  // box when Playwright clips the viewport for the screenshot.
  await page.evaluate(() => {
    const header = document.querySelector('header');
    if (header) (header as HTMLElement).style.visibility = 'hidden';
  });

  await element.scrollIntoViewIfNeeded();
  // Allow Recharts SVG and CSS transitions to settle
  await page.waitForTimeout(600);
  await element.screenshot({ path: outputPath });

  // Restore header visibility before the next interaction
  await page.evaluate(() => {
    const header = document.querySelector('header');
    if (header) (header as HTMLElement).style.visibility = '';
  });

  return true;
}

// Re-export for convenience
export { OUTPUT_DIR };

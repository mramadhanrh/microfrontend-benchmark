/**
 * capture-pages.ts
 *
 * Full-page screenshot capture for the Benchmark Visualizer.
 *
 * For every combination of page × network × optimization × tab it:
 *   1. Navigates the UI to that state.
 *   2. Scrolls through the entire page in steps so that all lazy-rendered
 *      Recharts SVGs have a chance to paint at their proper sizes.
 *   3. Scrolls back to the top.
 *   4. Takes a full-page (full scroll height) screenshot.
 *
 * Output tree:
 *   page-screenshots/
 *     {page}/
 *       {network}/
 *         {optimization}/
 *           {warm|cold|combined}/
 *             full-page.png
 *
 * Usage:
 *   npm run capture:pages
 *   npm run capture:pages -- --url http://localhost:4300 --output /custom/path
 */

import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { chromium } from 'playwright';
import type { Page } from 'playwright';
import {
  BASE_URL,
  PAGES,
  NETWORKS,
  OPTIMIZATIONS,
  TABS,
  TOTAL_PAGE_SCREENSHOTS,
} from './config';
import { waitForLoad, waitForDataReload } from './helpers';

// ── CLI argument parsing ───────────────────────────────────────────────────

function getArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  return idx !== -1 ? process.argv[idx + 1] : undefined;
}

const baseUrl = getArg('--url') ?? BASE_URL;
const outputRoot = resolve(getArg('--output') ?? 'page-screenshots');

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Wait for a tab's content to be visible by polling for the expected h2
 * heading text.  The Combined Overview tab uses "Combined Overview"; the
 * Warm/Cold tabs use "<Label> Benchmark".
 */
async function waitForTabContent(
  page: Page,
  waitHeading: string
): Promise<void> {
  await page.waitForSelector(`h2:has-text("${waitHeading}")`, {
    timeout: 15_000,
  });
}

/**
 * Scroll through the full page height in 600 px steps with a short pause
 * between each step.  This forces Recharts ResponsiveContainer elements
 * (which only measure themselves once visible) to paint at their full size
 * before the final screenshot is taken.
 *
 * Scrolling is driven from the Node side (no async function passed to
 * page.evaluate) to avoid tsx/esbuild injecting __name() helpers that are
 * not available inside Playwright's isolated browser context.
 */
async function scrollToTriggerRenders(page: Page): Promise<void> {
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  const step = 600;

  for (let y = step; y < scrollHeight; y += step) {
    await page.evaluate((scrollY: number) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(120);
  }

  // Settle at the bottom
  await page.waitForTimeout(400);
  // Return to top before taking the screenshot
  await page.evaluate(() => window.scrollTo(0, 0));
  // Final paint settle
  await page.waitForTimeout(600);
}

/**
 * Build the output file path for a full-page screenshot.
 */
function buildPageOutputPath(
  pageDir: string,
  networkDir: string,
  optimizationDir: string,
  tabDir: string
): string {
  return `${outputRoot}/${pageDir}/${networkDir}/${optimizationDir}/${tabDir}/full-page.png`;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('Benchmark Visualizer — Full-Page Screenshot Capture');
  console.log(`  Base URL : ${baseUrl}`);
  console.log(`  Output   : ${outputRoot}`);
  console.log(`  Total    : ${TOTAL_PAGE_SCREENSHOTS} screenshots`);
  console.log('');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    // Wide viewport so the dashboard layout renders at desktop width.
    // Height is intentionally large but will be overridden by fullPage:true.
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  page.on('console', () => {
    /* suppress app noise */
  });

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await waitForLoad(page);

  let captured = 0;

  // Loop order: network → optimization (each reloads data)
  //             → page (client-side filter, no reload)
  //             → tab  (client-side switch, no reload)

  for (const network of NETWORKS) {
    console.log(`\nNetwork: ${network.label}`);

    await page
      .getByRole('button', { name: network.label, exact: true })
      .click();
    await waitForDataReload(page);

    for (const optimization of OPTIMIZATIONS) {
      console.log(`  Optimization: ${optimization.label}`);

      await page
        .getByRole('button', { name: optimization.label, exact: true })
        .click();
      await waitForDataReload(page);

      for (const pg of PAGES) {
        // Page selection only changes `activePage` — no data reload, no spinner.
        await page.getByRole('button', { name: pg.label, exact: true }).click();
        await page.waitForTimeout(200);

        for (const tab of TABS) {
          // Click the tab in the scenario tab nav (nav.w-fit)
          await page
            .locator('nav.w-fit')
            .getByRole('button', { name: tab.label, exact: true })
            .click();

          await waitForTabContent(page, tab.waitHeading);

          // Scroll through the page to trigger all lazy chart renders, then
          // scroll back to top before taking the screenshot.
          await scrollToTriggerRenders(page);

          const outputPath = buildPageOutputPath(
            pg.dir,
            network.dir,
            optimization.dir,
            tab.dir
          );

          mkdirSync(dirname(outputPath), { recursive: true });
          await page.screenshot({ path: outputPath, fullPage: true });

          captured++;
          const rel = outputPath.replace(outputRoot + '/', '');
          console.log(`    [${captured}/${TOTAL_PAGE_SCREENSHOTS}] ${rel}`);
        }
      }
    }
  }

  await browser.close();

  console.log('');
  console.log('Done.');
  console.log(`  Captured : ${captured}`);
  console.log(`  Output   : ${outputRoot}`);
}

main().catch((err: unknown) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

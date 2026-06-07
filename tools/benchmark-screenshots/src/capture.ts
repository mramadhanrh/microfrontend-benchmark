import { resolve } from 'node:path';
import { chromium } from 'playwright';
import {
  BASE_URL,
  PAGES,
  NETWORKS,
  OPTIMIZATIONS,
  SCENARIOS,
  SECTION_FILES,
  TOTAL_SCREENSHOTS,
} from './config';
import type { SectionKey } from './config';
import {
  waitForLoad,
  waitForDataReload,
  waitForScenario,
  getSectionLocators,
  buildOutputPath,
  scrollAndCapture,
} from './helpers';

// ── CLI argument parsing ───────────────────────────────────────────────────

function getArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  return idx !== -1 ? process.argv[idx + 1] : undefined;
}

const baseUrl = getArg('--url') ?? BASE_URL;
const outputRoot = resolve(getArg('--output') ?? 'screenshots');

// ── Main ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('Benchmark Visualizer — Screenshot Capture');
  console.log(`  Base URL : ${baseUrl}`);
  console.log(`  Output   : ${outputRoot}`);
  console.log(`  Total    : ${TOTAL_SCREENSHOTS} screenshots`);
  console.log('');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  // Silence console noise from the app
  page.on('console', () => {
    /* suppress */
  });

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await waitForLoad(page);

  let captured = 0;
  let skipped = 0;

  // Outer loops: network → optimization trigger data reloads.
  // Page changes only filter already-loaded data (no reload).
  // Scenario tab changes are client-side only (no reload).

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
        // Click the page button in the sticky header PageSelector.
        // This only updates `activePage` — no network request, no spinner.
        await page.getByRole('button', { name: pg.label, exact: true }).click();
        // Give React a tick to re-render the page-filtered content
        await page.waitForTimeout(200);

        for (const scenario of SCENARIOS) {
          // Scope click to the tab nav (nav.w-fit) to avoid ambiguity
          await page
            .locator('nav.w-fit')
            .getByRole('button', { name: scenario.label, exact: true })
            .click();
          await waitForScenario(page, scenario.label);
          // Extra wait for Recharts SVG to finish painting
          await page.waitForTimeout(800);

          const sections = getSectionLocators(page);

          for (const sectionKey of Object.keys(SECTION_FILES) as SectionKey[]) {
            const outputPath = buildOutputPath(
              outputRoot,
              pg.dir,
              network.dir,
              optimization.dir,
              scenario.dir,
              sectionKey
            );

            const ok = await scrollAndCapture(sections[sectionKey], outputPath);

            if (ok) {
              captured++;
              const rel = outputPath.replace(outputRoot + '/', '');
              console.log(`    [${captured}/${TOTAL_SCREENSHOTS}] ${rel}`);
            } else {
              skipped++;
              const rel = outputPath.replace(outputRoot + '/', '');
              console.warn(`    SKIP (element not found): ${rel}`);
            }
          }
        }
      }
    }
  }

  await browser.close();

  console.log('');
  console.log(`Done.`);
  console.log(`  Captured : ${captured}`);
  if (skipped > 0) {
    console.log(
      `  Skipped  : ${skipped} (benchmark data not available for those combinations)`
    );
  }
  console.log(`  Output   : ${outputRoot}`);
}

main().catch((err: unknown) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

import type {
  SummaryJson,
  ProjectType,
  ScenarioType,
  NetworkProfile,
  OptimizationType,
  PageManifest,
  PageBenchmarkData,
  PageInfo,
} from '../types/benchmark';

export async function loadManifest(): Promise<PageManifest> {
  try {
    const response = await fetch('/data/manifest.json');
    if (!response.ok) return { pages: [] };
    return await response.json();
  } catch {
    return { pages: [] };
  }
}

export async function loadBenchmarkData(
  project: ProjectType,
  page: string,
  scenario: ScenarioType,
  network: NetworkProfile = 'none',
  optimization: OptimizationType = 'optimized'
): Promise<SummaryJson | null> {
  try {
    const opt = project === 'monolith' ? 'default' : optimization;
    const response = await fetch(
      `/data/${project}/${page}/${scenario}/${network}/${opt}/summary.json`
    );
    if (!response.ok) return null;
    const data: SummaryJson = await response.json();
    if (!data.lighthouseResults || data.lighthouseResults.length === 0) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export async function loadPageData(
  pageId: string,
  network: NetworkProfile = 'none',
  optimization: OptimizationType = 'optimized'
): Promise<PageBenchmarkData> {
  const [mfeWarm, mfeCold, monolithWarm, monolithCold] = await Promise.all([
    loadBenchmarkData('mfe', pageId, 'warm', network, optimization),
    loadBenchmarkData('mfe', pageId, 'cold', network, optimization),
    loadBenchmarkData('monolith', pageId, 'warm', network),
    loadBenchmarkData('monolith', pageId, 'cold', network),
  ]);

  return { mfeWarm, mfeCold, monolithWarm, monolithCold };
}

export async function loadAllPagesData(
  pages: PageInfo[],
  network: NetworkProfile = 'none',
  optimization: OptimizationType = 'optimized'
): Promise<Record<string, PageBenchmarkData>> {
  const entries = await Promise.all(
    pages.map(async (p) => {
      const data = await loadPageData(p.id, network, optimization);
      return [p.id, data] as const;
    })
  );
  return Object.fromEntries(entries);
}

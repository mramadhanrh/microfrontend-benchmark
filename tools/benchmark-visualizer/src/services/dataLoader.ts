import type {
  SummaryJson,
  ProjectType,
  ScenarioType,
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
  scenario: ScenarioType
): Promise<SummaryJson | null> {
  try {
    const response = await fetch(
      `/data/${project}/${page}/${scenario}/summary.json`
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
  pageId: string
): Promise<PageBenchmarkData> {
  const [mfeWarm, mfeCold, monolithWarm, monolithCold] = await Promise.all([
    loadBenchmarkData('mfe', pageId, 'warm'),
    loadBenchmarkData('mfe', pageId, 'cold'),
    loadBenchmarkData('monolith', pageId, 'warm'),
    loadBenchmarkData('monolith', pageId, 'cold'),
  ]);

  return { mfeWarm, mfeCold, monolithWarm, monolithCold };
}

export async function loadAllPagesData(
  pages: PageInfo[]
): Promise<Record<string, PageBenchmarkData>> {
  const entries = await Promise.all(
    pages.map(async (p) => {
      const data = await loadPageData(p.id);
      return [p.id, data] as const;
    })
  );
  return Object.fromEntries(entries);
}

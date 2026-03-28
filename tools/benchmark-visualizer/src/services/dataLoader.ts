import type {
  SummaryJson,
  ProjectType,
  ScenarioType,
} from '../types/benchmark';

export async function loadBenchmarkData(
  project: ProjectType,
  scenario: ScenarioType
): Promise<SummaryJson | null> {
  try {
    const response = await fetch(`/data/${project}/${scenario}/summary.json`);
    if (!response.ok) return null;
    const data: SummaryJson = await response.json();
    // Validate that there's actual data
    if (!data.lighthouseResults || data.lighthouseResults.length === 0) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export async function loadAllBenchmarkData(): Promise<{
  mfeWarm: SummaryJson | null;
  mfeCold: SummaryJson | null;
  monolithWarm: SummaryJson | null;
  monolithCold: SummaryJson | null;
}> {
  const [mfeWarm, mfeCold, monolithWarm, monolithCold] = await Promise.all([
    loadBenchmarkData('mfe', 'warm'),
    loadBenchmarkData('mfe', 'cold'),
    loadBenchmarkData('monolith', 'warm'),
    loadBenchmarkData('monolith', 'cold'),
  ]);

  return { mfeWarm, mfeCold, monolithWarm, monolithCold };
}

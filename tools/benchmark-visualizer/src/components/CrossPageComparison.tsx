import { useState } from 'react';
import type {
  PageInfo,
  PageBenchmarkData,
  MetricKey,
} from '../types/benchmark';
import { METRIC_KEYS } from '../types/benchmark';
import {
  formatMetricName,
  formatMetricValue,
  percentDifference,
} from '../utils/format';

interface CrossPageComparisonProps {
  pages: PageInfo[];
  allPagesData: Record<string, PageBenchmarkData>;
}

type Scenario = 'warm' | 'cold';

export default function CrossPageComparison({
  pages,
  allPagesData,
}: CrossPageComparisonProps) {
  const [scenario, setScenario] = useState<Scenario>('warm');

  const pagesWithData = pages.filter((page) => {
    const d = allPagesData[page.id];
    if (!d) return false;
    if (scenario === 'warm') return d.mfeWarm || d.monolithWarm;
    return d.mfeCold || d.monolithCold;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Cross-Page Comparison
          </h2>
          <p className="text-neutral-500 text-sm mt-1">
            Compare performance metrics across all pages for both architectures.
          </p>
        </div>
        <div className="flex gap-1 bg-surface-1 rounded-lg p-1">
          {(['warm', 'cold'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScenario(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                scenario === s
                  ? 'bg-surface-3 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {s === 'warm' ? 'Warm Start' : 'Cold Start'}
            </button>
          ))}
        </div>
      </div>

      {pagesWithData.length === 0 ? (
        <div className="bg-surface-2 rounded-xl border border-neutral-800 border-dashed p-12 text-center">
          <p className="text-neutral-500">
            No pages have benchmark data for{' '}
            {scenario === 'warm' ? 'warm' : 'cold'} start yet.
          </p>
        </div>
      ) : (
        METRIC_KEYS.map((metricKey) => (
          <MetricCrossPageTable
            key={metricKey}
            metricKey={metricKey}
            scenario={scenario}
            pages={pagesWithData}
            allPagesData={allPagesData}
          />
        ))
      )}
    </div>
  );
}

function MetricCrossPageTable({
  metricKey,
  scenario,
  pages,
  allPagesData,
}: {
  metricKey: MetricKey;
  scenario: Scenario;
  pages: PageInfo[];
  allPagesData: Record<string, PageBenchmarkData>;
}) {
  const rows = pages.map((page) => {
    const d = allPagesData[page.id];
    const mfe =
      scenario === 'warm'
        ? d?.mfeWarm?.benchmarkSummary?.[metricKey]
        : d?.mfeCold?.benchmarkSummary?.[metricKey];
    const mono =
      scenario === 'warm'
        ? d?.monolithWarm?.benchmarkSummary?.[metricKey]
        : d?.monolithCold?.benchmarkSummary?.[metricKey];

    const mfeMean = mfe?.mean ?? null;
    const monoMean = mono?.mean ?? null;
    const diff =
      mfeMean !== null && monoMean !== null
        ? percentDifference(mfeMean, monoMean)
        : null;

    let winner: 'mfe' | 'monolith' | 'tie' | null = null;
    if (mfeMean !== null && monoMean !== null) {
      // For CLS, lower is better. For all others, lower is also better.
      if (mfeMean < monoMean) winner = 'mfe';
      else if (monoMean < mfeMean) winner = 'monolith';
      else winner = 'tie';
    }

    return { page, mfeMean, monoMean, diff, winner };
  });

  // Find best values across pages (lowest mean)
  const mfeValues = rows.map((r) => r.mfeMean).filter(Boolean) as number[];
  const monoValues = rows.map((r) => r.monoMean).filter(Boolean) as number[];
  const bestMfe = mfeValues.length > 0 ? Math.min(...mfeValues) : null;
  const bestMono = monoValues.length > 0 ? Math.min(...monoValues) : null;

  return (
    <div className="bg-surface-2 rounded-xl border border-neutral-800 p-5">
      <h3 className="text-sm font-semibold text-white mb-3">
        {formatMetricName(metricKey)}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-700">
              <th className="py-2 px-3 text-left text-neutral-400 font-medium text-xs">
                Page
              </th>
              <th className="py-2 px-3 text-right text-xs">
                <span className="text-blue-400 font-medium">MFE Mean</span>
              </th>
              <th className="py-2 px-3 text-right text-xs">
                <span className="text-purple-400 font-medium">
                  Monolith Mean
                </span>
              </th>
              <th className="py-2 px-3 text-right text-neutral-400 font-medium text-xs">
                Δ%
              </th>
              <th className="py-2 px-3 text-center text-neutral-400 font-medium text-xs">
                Winner
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ page, mfeMean, monoMean, diff, winner }) => (
              <tr
                key={page.id}
                className="border-b border-neutral-800 hover:bg-surface-3/50 transition-colors"
              >
                <td className="py-2.5 px-3 text-white font-medium">
                  {page.label}
                  <span className="text-neutral-600 text-xs ml-1.5">
                    {page.path}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-neutral-300">
                  <span
                    className={
                      mfeMean !== null && mfeMean === bestMfe
                        ? 'text-green-400'
                        : ''
                    }
                  >
                    {mfeMean !== null
                      ? formatMetricValue(metricKey, mfeMean)
                      : '—'}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-neutral-300">
                  <span
                    className={
                      monoMean !== null && monoMean === bestMono
                        ? 'text-green-400'
                        : ''
                    }
                  >
                    {monoMean !== null
                      ? formatMetricValue(metricKey, monoMean)
                      : '—'}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-xs text-neutral-400">
                  {diff ?? '—'}
                </td>
                <td className="py-2.5 px-3 text-center">
                  {winner === 'mfe' && (
                    <span className="text-xs text-blue-400 font-medium">
                      MFE
                    </span>
                  )}
                  {winner === 'monolith' && (
                    <span className="text-xs text-purple-400 font-medium">
                      Monolith
                    </span>
                  )}
                  {winner === 'tie' && (
                    <span className="text-xs text-neutral-500">Tie</span>
                  )}
                  {winner === null && (
                    <span className="text-neutral-600">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

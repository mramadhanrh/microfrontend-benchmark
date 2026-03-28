import type { SummaryJson, MetricKey } from '../types/benchmark';
import { METRIC_KEYS } from '../types/benchmark';
import {
  formatMetricName,
  formatMetricValue,
  percentDifference,
} from '../utils/format';
import { welchTTest, type TTestResult } from '../utils/ttest';

interface StatisticalTableProps {
  mfeData: SummaryJson | null;
  monolithData: SummaryJson | null;
  title: string;
}

interface RowData {
  metricKey: MetricKey;
  metricName: string;
  mfeMean: number | null;
  monolithMean: number | null;
  difference: string;
  ttest: TTestResult | null;
  winner: 'mfe' | 'monolith' | 'tie' | null;
}

function computeRows(
  mfeData: SummaryJson | null,
  monolithData: SummaryJson | null
): RowData[] {
  return METRIC_KEYS.map((key) => {
    const mfeSummary = mfeData?.benchmarkSummary?.[key];
    const monolithSummary = monolithData?.benchmarkSummary?.[key];
    const mfeMean = mfeSummary?.mean ?? null;
    const monolithMean = monolithSummary?.mean ?? null;

    let ttest: TTestResult | null = null;
    if (
      mfeData?.benchmarkTTestTable?.[key] &&
      monolithData?.benchmarkTTestTable?.[key]
    ) {
      ttest = welchTTest(
        mfeData.benchmarkTTestTable[key],
        monolithData.benchmarkTTestTable[key]
      );
    }

    let winner: 'mfe' | 'monolith' | 'tie' | null = null;
    if (mfeMean !== null && monolithMean !== null) {
      // For all metrics, lower is better
      if (ttest?.significant) {
        winner = mfeMean < monolithMean ? 'mfe' : 'monolith';
      } else if (ttest) {
        winner = 'tie';
      }
    }

    return {
      metricKey: key,
      metricName: formatMetricName(key),
      mfeMean,
      monolithMean,
      difference:
        mfeMean !== null && monolithMean !== null
          ? percentDifference(mfeMean, monolithMean)
          : '—',
      ttest,
      winner,
    };
  });
}

function SignificanceBadge({ significant }: { significant: boolean }) {
  if (significant) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/30">
        Significant
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-700/50 text-neutral-400 border border-neutral-600">
      Not Significant
    </span>
  );
}

function WinnerBadge({
  winner,
}: {
  winner: 'mfe' | 'monolith' | 'tie' | null;
}) {
  if (!winner || winner === 'tie') {
    return <span className="text-neutral-500 text-xs">—</span>;
  }
  const isMfe = winner === 'mfe';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        isMfe
          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
          : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
      }`}
    >
      {isMfe ? 'MFE' : 'Monolith'}
    </span>
  );
}

export default function StatisticalTable({
  mfeData,
  monolithData,
  title,
}: StatisticalTableProps) {
  const rows = computeRows(mfeData, monolithData);
  const hasBothDatasets = mfeData !== null && monolithData !== null;

  return (
    <div className="bg-surface-2 rounded-xl border border-neutral-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-xs text-neutral-500 mb-4">
        {hasBothDatasets
          ? "Welch's two-sample t-test (α = 0.05, two-tailed). Lower values are better for all metrics."
          : 'Comparison will be available when both MFE and Monolith data are loaded.'}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-700">
              <th className="py-3 px-3 text-left text-neutral-400 font-medium">
                Metric
              </th>
              <th className="py-3 px-3 text-right text-blue-400 font-medium">
                MFE Mean
              </th>
              <th className="py-3 px-3 text-right text-purple-400 font-medium">
                Monolith Mean
              </th>
              <th className="py-3 px-3 text-right text-neutral-400 font-medium">
                Δ%
              </th>
              {hasBothDatasets && (
                <>
                  <th className="py-3 px-3 text-right text-neutral-400 font-medium">
                    t-stat
                  </th>
                  <th className="py-3 px-3 text-right text-neutral-400 font-medium">
                    p-value
                  </th>
                  <th className="py-3 px-3 text-center text-neutral-400 font-medium">
                    Significance
                  </th>
                  <th className="py-3 px-3 text-center text-neutral-400 font-medium">
                    Winner
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.metricKey}
                className="border-b border-neutral-800 hover:bg-surface-3/50 transition-colors"
              >
                <td className="py-3 px-3 text-white font-medium">
                  {row.metricName}
                </td>
                <td className="py-3 px-3 text-right font-mono text-neutral-300">
                  {row.mfeMean !== null
                    ? formatMetricValue(row.metricKey, row.mfeMean)
                    : '—'}
                </td>
                <td className="py-3 px-3 text-right font-mono text-neutral-300">
                  {row.monolithMean !== null
                    ? formatMetricValue(row.metricKey, row.monolithMean)
                    : '—'}
                </td>
                <td
                  className={`py-3 px-3 text-right font-mono ${
                    row.difference.startsWith('-')
                      ? 'text-green-400'
                      : row.difference.startsWith('+')
                      ? 'text-red-400'
                      : 'text-neutral-500'
                  }`}
                >
                  {row.difference}
                </td>
                {hasBothDatasets && (
                  <>
                    <td className="py-3 px-3 text-right font-mono text-neutral-400">
                      {row.ttest ? row.ttest.tStatistic.toFixed(3) : '—'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-neutral-400">
                      {row.ttest
                        ? row.ttest.pValue < 0.001
                          ? '< 0.001'
                          : row.ttest.pValue.toFixed(4)
                        : '—'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {row.ttest ? (
                        <SignificanceBadge
                          significant={row.ttest.significant}
                        />
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <WinnerBadge winner={row.winner} />
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasBothDatasets && (
        <div className="mt-4 p-3 bg-surface-1 rounded-lg border border-neutral-800 text-xs text-neutral-500">
          <strong className="text-neutral-400">How to read:</strong> Δ% shows
          the percentage difference of MFE relative to Monolith (negative = MFE
          is faster). The t-test checks whether the difference is statistically
          significant at α = 0.05. &quot;Winner&quot; is only assigned when the
          difference is significant.
        </div>
      )}
    </div>
  );
}

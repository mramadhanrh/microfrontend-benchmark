import type { SummaryJson, MetricKey } from '../types/benchmark';
import { METRIC_KEYS } from '../types/benchmark';
import {
  formatMetricName,
  formatMetricValue,
  percentDifference,
} from '../utils/format';

interface CombinedOverviewProps {
  mfeWarm: SummaryJson | null;
  mfeCold: SummaryJson | null;
  monolithWarm: SummaryJson | null;
  monolithCold: SummaryJson | null;
}

export default function CombinedOverview({
  mfeWarm,
  mfeCold,
  monolithWarm,
  monolithCold,
}: CombinedOverviewProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Combined Overview</h2>
        <p className="text-neutral-500 text-sm mt-1">
          Side-by-side comparison of cold and warm start benchmarks across both
          architectures.
        </p>
      </div>

      {/* Summary comparison table */}
      <div className="bg-surface-2 rounded-xl border border-neutral-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          All Metrics at a Glance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-700">
                <th className="py-3 px-3 text-left text-neutral-400 font-medium">
                  Metric
                </th>
                <th className="py-3 px-3 text-center" colSpan={2}>
                  <span className="text-blue-400 font-medium">
                    Microfrontend
                  </span>
                </th>
                <th className="py-3 px-3 text-center" colSpan={2}>
                  <span className="text-purple-400 font-medium">Monolith</span>
                </th>
              </tr>
              <tr className="border-b border-neutral-800 text-xs text-neutral-500">
                <th className="py-2 px-3 text-left" />
                <th className="py-2 px-3 text-right">Cold</th>
                <th className="py-2 px-3 text-right">Warm</th>
                <th className="py-2 px-3 text-right">Cold</th>
                <th className="py-2 px-3 text-right">Warm</th>
              </tr>
            </thead>
            <tbody>
              {METRIC_KEYS.map((key) => (
                <CombinedRow
                  key={key}
                  metricKey={key}
                  mfeCold={mfeCold}
                  mfeWarm={mfeWarm}
                  monolithCold={monolithCold}
                  monolithWarm={monolithWarm}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cold vs warm impact */}
      <div className="bg-surface-2 rounded-xl border border-neutral-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-1">
          Cold Start Impact
        </h3>
        <p className="text-xs text-neutral-500 mb-4">
          How much slower is the cold start compared to warm start for each
          architecture?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ColdWarmImpactCard
            label="Microfrontend"
            color="#3b82f6"
            warm={mfeWarm}
            cold={mfeCold}
          />
          <ColdWarmImpactCard
            label="Monolith"
            color="#a855f7"
            warm={monolithWarm}
            cold={monolithCold}
          />
        </div>
      </div>
    </div>
  );
}

function CombinedRow({
  metricKey,
  mfeCold,
  mfeWarm,
  monolithCold,
  monolithWarm,
}: {
  metricKey: MetricKey;
  mfeCold: SummaryJson | null;
  mfeWarm: SummaryJson | null;
  monolithCold: SummaryJson | null;
  monolithWarm: SummaryJson | null;
}) {
  const mfeColdMean = mfeCold?.benchmarkSummary?.[metricKey]?.mean ?? null;
  const mfeWarmMean = mfeWarm?.benchmarkSummary?.[metricKey]?.mean ?? null;
  const monolithColdMean =
    monolithCold?.benchmarkSummary?.[metricKey]?.mean ?? null;
  const monolithWarmMean =
    monolithWarm?.benchmarkSummary?.[metricKey]?.mean ?? null;

  return (
    <tr className="border-b border-neutral-800 hover:bg-surface-3/50 transition-colors">
      <td className="py-3 px-3 text-white font-medium">
        {formatMetricName(metricKey)}
      </td>
      <td className="py-3 px-3 text-right font-mono text-neutral-300">
        {mfeColdMean !== null ? formatMetricValue(metricKey, mfeColdMean) : '—'}
      </td>
      <td className="py-3 px-3 text-right font-mono text-neutral-300">
        {mfeWarmMean !== null ? formatMetricValue(metricKey, mfeWarmMean) : '—'}
      </td>
      <td className="py-3 px-3 text-right font-mono text-neutral-300">
        {monolithColdMean !== null
          ? formatMetricValue(metricKey, monolithColdMean)
          : '—'}
      </td>
      <td className="py-3 px-3 text-right font-mono text-neutral-300">
        {monolithWarmMean !== null
          ? formatMetricValue(metricKey, monolithWarmMean)
          : '—'}
      </td>
    </tr>
  );
}

function ColdWarmImpactCard({
  label,
  color,
  warm,
  cold,
}: {
  label: string;
  color: string;
  warm: SummaryJson | null;
  cold: SummaryJson | null;
}) {
  const relevantMetrics: MetricKey[] = [
    'speedIndex',
    'firstContentfulPaint',
    'largestContentfulPaint',
    'timeToInteractive',
  ];

  if (!warm?.benchmarkSummary || !cold?.benchmarkSummary) {
    return (
      <div className="bg-surface-1 rounded-lg border border-neutral-800 border-dashed p-6 text-center">
        <p className="text-neutral-500 text-sm">
          Need both warm and cold data for {label}
        </p>
      </div>
    );
  }

  const warmSummary = warm.benchmarkSummary;
  const coldSummary = cold.benchmarkSummary;

  return (
    <div className="bg-surface-1 rounded-lg border border-neutral-800 p-4">
      <h4 className="font-semibold text-white flex items-center gap-2 mb-3">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        {label}
      </h4>
      <div className="space-y-2">
        {relevantMetrics.map((key) => {
          const warmMean = warmSummary[key].mean;
          const coldMean = coldSummary[key].mean;
          const diff = percentDifference(coldMean, warmMean);

          return (
            <div
              key={key}
              className="flex items-center justify-between text-sm py-1"
            >
              <span className="text-neutral-400">{formatMetricName(key)}</span>
              <span
                className={`font-mono text-xs ${
                  diff.startsWith('+') ? 'text-red-400' : 'text-green-400'
                }`}
              >
                {diff}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

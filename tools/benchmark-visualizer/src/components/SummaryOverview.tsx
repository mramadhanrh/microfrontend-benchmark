import type { SummaryJson, MetricKey } from '../types/benchmark';
import { METRIC_KEYS } from '../types/benchmark';
import MetricCard from './MetricCard';

interface SummaryOverviewProps {
  mfeData: SummaryJson | null;
  monolithData: SummaryJson | null;
}

function ProjectMetrics({
  data,
  label,
  accentColor,
}: {
  data: SummaryJson | null;
  label: string;
  accentColor: string;
}) {
  if (!data?.benchmarkSummary) {
    return (
      <div className="flex-1">
        <h3
          className="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ color: accentColor }}
        >
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          {label}
        </h3>
        <div className="bg-surface-2 rounded-xl border border-neutral-800 border-dashed p-8 text-center">
          <p className="text-neutral-500 text-sm">Awaiting benchmark data</p>
          <p className="text-neutral-600 text-xs mt-1">
            Run benchmarks and place summary.json in the data directory
          </p>
        </div>
      </div>
    );
  }

  const { benchmarkSummary } = data;
  const metrics: MetricKey[] = METRIC_KEYS;

  return (
    <div className="flex-1 min-w-0">
      <h3
        className="text-lg font-semibold mb-4 flex items-center gap-2"
        style={{ color: accentColor }}
      >
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        {label}
        <span className="text-neutral-500 text-xs font-normal ml-auto">
          n={data.lighthouseResults.length} runs
        </span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {metrics.map((key) => (
          <MetricCard
            key={key}
            metricKey={key}
            summary={benchmarkSummary[key]}
            sampleSize={data.lighthouseResults.length}
            accentColor={accentColor}
          />
        ))}
      </div>
    </div>
  );
}

export default function SummaryOverview({
  mfeData,
  monolithData,
}: SummaryOverviewProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <ProjectMetrics
          data={mfeData}
          label="Microfrontend"
          accentColor="#3b82f6"
        />
        <ProjectMetrics
          data={monolithData}
          label="Monolith"
          accentColor="#a855f7"
        />
      </div>
    </div>
  );
}

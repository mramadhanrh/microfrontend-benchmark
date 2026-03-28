import type { SummaryJson, MetricKey } from '../types/benchmark';
import SummaryOverview from './SummaryOverview';
import ComparisonBarChart from './ComparisonBarChart';
import DistributionChart from './DistributionChart';
import StatisticalTable from './StatisticalTable';

interface ScenarioSectionProps {
  scenario: 'warm' | 'cold';
  mfeData: SummaryJson | null;
  monolithData: SummaryJson | null;
}

const DISTRIBUTION_METRICS: MetricKey[] = [
  'speedIndex',
  'firstContentfulPaint',
  'largestContentfulPaint',
  'timeToInteractive',
];

export default function ScenarioSection({
  scenario,
  mfeData,
  monolithData,
}: ScenarioSectionProps) {
  const label = scenario === 'warm' ? 'Warm Start' : 'Cold Start';

  return (
    <div className="space-y-8">
      {/* Section header */}
      <div>
        <h2 className="text-2xl font-bold text-white">{label} Benchmark</h2>
        <p className="text-neutral-500 text-sm mt-1">
          {scenario === 'warm'
            ? 'Measurements with browser cache primed — reflects repeat visitor experience.'
            : 'Measurements with empty cache — reflects first-time visitor experience.'}
        </p>
      </div>

      {/* Metric summary cards */}
      <SummaryOverview mfeData={mfeData} monolithData={monolithData} />

      {/* Comparison bar chart */}
      <ComparisonBarChart
        mfeData={mfeData}
        monolithData={monolithData}
        title={`${label} — Mean Performance Comparison`}
      />

      {/* Distribution charts */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Distribution Analysis
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {DISTRIBUTION_METRICS.map((metric) => (
            <DistributionChart
              key={metric}
              metricKey={metric}
              mfeData={mfeData}
              monolithData={monolithData}
            />
          ))}
        </div>
      </div>

      {/* Statistical analysis table */}
      <StatisticalTable
        mfeData={mfeData}
        monolithData={monolithData}
        title={`${label} — Statistical Comparison`}
      />
    </div>
  );
}

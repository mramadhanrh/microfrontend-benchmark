import type { MetricKey, MetricSummary } from '../types/benchmark';
import {
  formatMetricName,
  formatMetricShortName,
  formatMetricValue,
  getRating,
  getRatingBgClass,
} from '../utils/format';

interface MetricCardProps {
  metricKey: MetricKey;
  summary: MetricSummary;
  sampleSize: number;
  accentColor?: string;
}

export default function MetricCard({
  metricKey,
  summary,
  sampleSize,
  accentColor,
}: MetricCardProps) {
  const rating = getRating(metricKey, summary.mean);
  const ratingClasses = getRatingBgClass(rating);

  return (
    <div className="bg-surface-2 rounded-xl border border-neutral-800 p-5 hover:border-neutral-700 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span
            className="text-xs font-mono font-medium tracking-wider uppercase"
            style={{ color: accentColor }}
          >
            {formatMetricShortName(metricKey)}
          </span>
          <h3 className="text-sm text-neutral-400 mt-0.5">
            {formatMetricName(metricKey)}
          </h3>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full border font-medium text-center ${ratingClasses}`}
        >
          {rating === 'needs-improvement'
            ? 'Needs Work'
            : rating === 'good'
            ? 'Good'
            : 'Poor'}
        </span>
      </div>

      <div className="mb-4">
        <span className="text-3xl font-bold text-white">
          {formatMetricValue(metricKey, summary.mean)}
        </span>
        <span className="text-xs text-neutral-500 ml-2">mean</span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs">
        <div>
          <span className="text-neutral-500 block">Median</span>
          <span className="text-neutral-300 font-mono">
            {formatMetricValue(metricKey, summary.median)}
          </span>
        </div>
        <div>
          <span className="text-neutral-500 block">Min</span>
          <span className="text-neutral-300 font-mono">
            {formatMetricValue(metricKey, summary.min)}
          </span>
        </div>
        <div>
          <span className="text-neutral-500 block">Max</span>
          <span className="text-neutral-300 font-mono">
            {formatMetricValue(metricKey, summary.max)}
          </span>
        </div>
        <div>
          <span className="text-neutral-500 block">Q1</span>
          <span className="text-neutral-300 font-mono">
            {formatMetricValue(metricKey, summary.q1)}
          </span>
        </div>
        <div>
          <span className="text-neutral-500 block">Q3</span>
          <span className="text-neutral-300 font-mono">
            {formatMetricValue(metricKey, summary.q3)}
          </span>
        </div>
        <div>
          <span className="text-neutral-500 block">n</span>
          <span className="text-neutral-300 font-mono">{sampleSize}</span>
        </div>
      </div>
    </div>
  );
}

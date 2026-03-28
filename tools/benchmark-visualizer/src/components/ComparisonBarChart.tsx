import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ErrorBar,
} from 'recharts';
import type { SummaryJson, MetricKey } from '../types/benchmark';
import { METRIC_KEYS } from '../types/benchmark';
import { formatMetricShortName, formatMs } from '../utils/format';

interface ComparisonBarChartProps {
  mfeData: SummaryJson | null;
  monolithData: SummaryJson | null;
  title: string;
}

interface ChartDatum {
  name: string;
  metricKey: MetricKey;
  mfe: number;
  monolith: number;
  mfeQ1: number;
  mfeQ3: number;
  monolithQ1: number;
  monolithQ3: number;
  mfeError: [number, number];
  monolithError: [number, number];
}

function buildChartData(
  mfeData: SummaryJson | null,
  monolithData: SummaryJson | null
): ChartDatum[] {
  // Filter out CLS (values are ~0 and don't compare well on same scale) and TBT (also ~0)
  const relevantMetrics: MetricKey[] = METRIC_KEYS.filter(
    (k) => k !== 'cumulativeLayoutShift' && k !== 'totalBlockingTime'
  );

  return relevantMetrics.map((key) => {
    const mfeSummary = mfeData?.benchmarkSummary?.[key];
    const monolithSummary = monolithData?.benchmarkSummary?.[key];

    const mfeMean = mfeSummary?.mean ?? 0;
    const monolithMean = monolithSummary?.mean ?? 0;

    return {
      name: formatMetricShortName(key),
      metricKey: key,
      mfe: Math.round(mfeMean),
      monolith: Math.round(monolithMean),
      mfeQ1: mfeSummary?.q1 ?? 0,
      mfeQ3: mfeSummary?.q3 ?? 0,
      monolithQ1: monolithSummary?.q1 ?? 0,
      monolithQ3: monolithSummary?.q3 ?? 0,
      mfeError: [
        Math.round(mfeMean - (mfeSummary?.q1 ?? mfeMean)),
        Math.round((mfeSummary?.q3 ?? mfeMean) - mfeMean),
      ],
      monolithError: [
        Math.round(monolithMean - (monolithSummary?.q1 ?? monolithMean)),
        Math.round((monolithSummary?.q3 ?? monolithMean) - monolithMean),
      ],
    };
  });
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    payload: ChartDatum;
  }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-surface-3 border border-neutral-700 rounded-lg p-3 shadow-xl">
      <p className="text-sm font-semibold text-white mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-neutral-400">{entry.name}:</span>
          <span className="text-white font-mono">{formatMs(entry.value)}</span>
        </div>
      ))}
      {payload[0] && (
        <div className="border-t border-neutral-700 mt-2 pt-2 text-xs text-neutral-500">
          <div>
            Q1→Q3: {formatMs(payload[0].payload.mfeQ1)} —{' '}
            {formatMs(payload[0].payload.mfeQ3)}
          </div>
          {payload[1] && (
            <div>
              Q1→Q3: {formatMs(payload[1].payload.monolithQ1)} —{' '}
              {formatMs(payload[1].payload.monolithQ3)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ComparisonBarChart({
  mfeData,
  monolithData,
  title,
}: ComparisonBarChartProps) {
  const data = buildChartData(mfeData, monolithData);
  const hasMonolith = monolithData !== null;

  return (
    <div className="bg-surface-2 rounded-xl border border-neutral-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-xs text-neutral-500 mb-6">
        Mean values with Q1–Q3 error bars (ms)
      </p>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#a3a3a3', fontSize: 12 }}
            axisLine={{ stroke: '#404040' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#a3a3a3', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => formatMs(v)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            iconType="circle"
          />
          <Bar
            dataKey="mfe"
            name="Microfrontend"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
          >
            <ErrorBar dataKey="mfeError" width={4} stroke="#60a5fa" />
          </Bar>
          {hasMonolith && (
            <Bar
              dataKey="monolith"
              name="Monolith"
              fill="#a855f7"
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            >
              <ErrorBar dataKey="monolithError" width={4} stroke="#c084fc" />
            </Bar>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

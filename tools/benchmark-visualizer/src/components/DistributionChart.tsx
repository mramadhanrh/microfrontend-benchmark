import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ZAxis,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';
import type { SummaryJson, MetricKey } from '../types/benchmark';
import {
  formatMetricName,
  formatMetricShortName,
  formatMs,
} from '../utils/format';

interface DistributionChartProps {
  metricKey: MetricKey;
  mfeData: SummaryJson | null;
  monolithData: SummaryJson | null;
}

interface JitteredPoint {
  x: number;
  y: number;
  label: string;
}

/** Deterministic seeded hash for consistent jitter across renders */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildJitteredPoints(
  data: SummaryJson | null,
  metricKey: MetricKey,
  centerX: number,
  label: string
): JitteredPoint[] {
  if (!data?.benchmarkTTestTable) return [];
  const values = data.benchmarkTTestTable[metricKey];
  const jitterWidth = 0.25;
  return values.map((v, i) => ({
    x: centerX + (seededRandom(i * 31 + centerX * 97) - 0.5) * jitterWidth,
    y: v,
    label,
  }));
}

const MFE_CENTER = 0;
const MONOLITH_CENTER = 1;

function CustomScatterTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: JitteredPoint }>;
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;

  return (
    <div className="bg-surface-3 border border-neutral-700 rounded-lg px-3 py-2 shadow-xl text-xs">
      <span className="text-neutral-400">{p.label}:</span>{' '}
      <span className="text-white font-mono">{formatMs(p.y)}</span>
    </div>
  );
}

export default function DistributionChart({
  metricKey,
  mfeData,
  monolithData,
}: DistributionChartProps) {
  const mfePoints = buildJitteredPoints(
    mfeData,
    metricKey,
    MFE_CENTER,
    'Microfrontend'
  );
  const monolithPoints = buildJitteredPoints(
    monolithData,
    metricKey,
    MONOLITH_CENTER,
    'Monolith'
  );

  if (mfePoints.length === 0 && monolithPoints.length === 0) return null;

  const allY = [...mfePoints, ...monolithPoints].map((p) => p.y);
  const yMin = Math.min(...allY) * 0.95;
  const yMax = Math.max(...allY) * 1.05;

  const mfeSummary = mfeData?.benchmarkSummary?.[metricKey];
  const monolithSummary = monolithData?.benchmarkSummary?.[metricKey];

  const hasMonolith = monolithPoints.length > 0;
  const xDomain: [number, number] = hasMonolith ? [-0.5, 1.5] : [-0.5, 0.5];

  const ticks = hasMonolith ? [MFE_CENTER, MONOLITH_CENTER] : [MFE_CENTER];
  const tickLabels: Record<number, string> = {
    [MFE_CENTER]: 'Microfrontend',
    [MONOLITH_CENTER]: 'Monolith',
  };

  return (
    <div className="bg-surface-2 rounded-xl border border-neutral-800 p-6">
      <h3 className="text-base font-semibold text-white mb-1">
        {formatMetricName(metricKey)}{' '}
        <span className="text-neutral-500 font-normal text-sm">
          ({formatMetricShortName(metricKey)})
        </span>
      </h3>
      <p className="text-xs text-neutral-500 mb-4">
        Distribution of individual measurements (jittered strip plot)
      </p>

      <ResponsiveContainer width="100%" height={250}>
        <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis
            type="number"
            dataKey="x"
            domain={xDomain}
            ticks={ticks}
            tickFormatter={(v: number) => tickLabels[v] ?? ''}
            tick={{ fill: '#a3a3a3', fontSize: 12 }}
            axisLine={{ stroke: '#404040' }}
            tickLine={false}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[yMin, yMax]}
            tick={{ fill: '#a3a3a3', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => formatMs(v)}
          />
          <ZAxis range={[20, 20]} />
          <Tooltip content={<CustomScatterTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            iconType="circle"
          />

          {/* IQR box regions */}
          {mfeSummary && (
            <ReferenceArea
              x1={MFE_CENTER - 0.2}
              x2={MFE_CENTER + 0.2}
              y1={mfeSummary.q1}
              y2={mfeSummary.q3}
              fill="#3b82f6"
              fillOpacity={0.1}
              stroke="#3b82f6"
              strokeOpacity={0.3}
            />
          )}
          {monolithSummary && (
            <ReferenceArea
              x1={MONOLITH_CENTER - 0.2}
              x2={MONOLITH_CENTER + 0.2}
              y1={monolithSummary.q1}
              y2={monolithSummary.q3}
              fill="#a855f7"
              fillOpacity={0.1}
              stroke="#a855f7"
              strokeOpacity={0.3}
            />
          )}

          {/* Median lines */}
          {mfeSummary && (
            <ReferenceLine
              segment={[
                { x: MFE_CENTER - 0.2, y: mfeSummary.median },
                { x: MFE_CENTER + 0.2, y: mfeSummary.median },
              ]}
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="4 2"
            />
          )}
          {monolithSummary && (
            <ReferenceLine
              segment={[
                { x: MONOLITH_CENTER - 0.2, y: monolithSummary.median },
                { x: MONOLITH_CENTER + 0.2, y: monolithSummary.median },
              ]}
              stroke="#a855f7"
              strokeWidth={2}
              strokeDasharray="4 2"
            />
          )}

          {/* Scatter points */}
          {mfePoints.length > 0 && (
            <Scatter
              data={mfePoints}
              name="MFE runs"
              fill="#3b82f6"
              opacity={0.6}
            />
          )}
          {monolithPoints.length > 0 && (
            <Scatter
              data={monolithPoints}
              name="Monolith runs"
              fill="#a855f7"
              opacity={0.6}
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>

      {/* Legend for box elements */}
      <div className="flex items-center justify-center gap-6 mt-2 text-xs text-neutral-500">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-2 bg-blue-500/10 border border-blue-500/30 rounded-sm" />
          <span>IQR (Q1–Q3)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 border-t-2 border-dashed border-neutral-400" />
          <span>Median</span>
        </div>
      </div>
    </div>
  );
}

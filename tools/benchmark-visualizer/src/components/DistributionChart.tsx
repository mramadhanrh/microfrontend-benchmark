import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
  Cell,
  ZAxis,
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

interface BoxPlotData {
  name: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  // For the bar rendering (q1 to q3 range)
  boxLow: number;
  boxHeight: number;
  // Whisker rendering
  whiskerLow: [number, number];
  whiskerHigh: [number, number];
}

function getBoxPlotData(
  data: SummaryJson | null,
  label: string,
  metricKey: MetricKey
): BoxPlotData | null {
  if (!data?.benchmarkSummary) return null;
  const summary = data.benchmarkSummary[metricKey];

  return {
    name: label,
    min: summary.min,
    q1: summary.q1,
    median: summary.median,
    q3: summary.q3,
    max: summary.max,
    boxLow: summary.q1,
    boxHeight: summary.q3 - summary.q1,
    whiskerLow: [summary.q1 - summary.min, 0],
    whiskerHigh: [0, summary.max - summary.q3],
  };
}

interface ScatterPoint {
  name: string;
  value: number;
  x: number;
}

function getScatterPoints(
  data: SummaryJson | null,
  label: string,
  metricKey: MetricKey,
  xIndex: number
): ScatterPoint[] {
  if (!data?.benchmarkTTestTable) return [];
  const values = data.benchmarkTTestTable[metricKey];
  return values.map((v) => ({ name: label, value: v, x: xIndex }));
}

function CustomBoxPlotTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: BoxPlotData }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  if (!d.min && d.min !== 0) return null;

  return (
    <div className="bg-surface-3 border border-neutral-700 rounded-lg p-3 shadow-xl text-xs">
      <p className="text-sm font-semibold text-white mb-2">{d.name}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-neutral-400">Max:</span>
          <span className="text-white font-mono">{formatMs(d.max)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-neutral-400">Q3:</span>
          <span className="text-white font-mono">{formatMs(d.q3)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-neutral-400">Median:</span>
          <span className="text-white font-mono">{formatMs(d.median)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-neutral-400">Q1:</span>
          <span className="text-white font-mono">{formatMs(d.q1)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-neutral-400">Min:</span>
          <span className="text-white font-mono">{formatMs(d.min)}</span>
        </div>
        <div className="flex justify-between gap-4 border-t border-neutral-700 pt-1">
          <span className="text-neutral-400">IQR:</span>
          <span className="text-white font-mono">{formatMs(d.q3 - d.q1)}</span>
        </div>
      </div>
    </div>
  );
}

export default function DistributionChart({
  metricKey,
  mfeData,
  monolithData,
}: DistributionChartProps) {
  const mfeBox = getBoxPlotData(mfeData, 'Microfrontend', metricKey);
  const monolithBox = getBoxPlotData(monolithData, 'Monolith', metricKey);

  const mfeScatter = getScatterPoints(mfeData, 'MFE', metricKey, 0);
  const monolithScatter = getScatterPoints(
    monolithData,
    'Monolith',
    metricKey,
    1
  );

  const allValues = [...mfeScatter, ...monolithScatter].map((p) => p.value);
  const items = [mfeBox, monolithBox].filter(Boolean) as BoxPlotData[];

  if (items.length === 0) return null;

  const yMin = allValues.length > 0 ? Math.min(...allValues) * 0.95 : 0;
  const yMax = allValues.length > 0 ? Math.max(...allValues) * 1.05 : 100;

  return (
    <div className="bg-surface-2 rounded-xl border border-neutral-800 p-6">
      <h3 className="text-base font-semibold text-white mb-1">
        {formatMetricName(metricKey)}{' '}
        <span className="text-neutral-500 font-normal text-sm">
          ({formatMetricShortName(metricKey)})
        </span>
      </h3>
      <p className="text-xs text-neutral-500 mb-4">
        Distribution of individual measurements
      </p>

      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart
          data={items}
          margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#a3a3a3', fontSize: 12 }}
            axisLine={{ stroke: '#404040' }}
            tickLine={false}
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fill: '#a3a3a3', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => formatMs(v)}
          />
          <Tooltip content={<CustomBoxPlotTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            iconType="circle"
          />

          {/* IQR box: stacked bar from Q1 to Q3 */}
          <Bar
            dataKey="boxLow"
            stackId="box"
            fill="transparent"
            name=" "
            legendType="none"
          />
          <Bar
            dataKey="boxHeight"
            stackId="box"
            name="IQR (Q1–Q3)"
            radius={[4, 4, 4, 4]}
            maxBarSize={60}
          >
            {items.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={index === 0 ? '#3b82f640' : '#a855f740'}
                stroke={index === 0 ? '#3b82f6' : '#a855f7'}
                strokeWidth={1.5}
              />
            ))}
          </Bar>

          {/* Scatter: individual data points for MFE */}
          {mfeScatter.length > 0 && (
            <Scatter
              data={mfeScatter.map((p) => ({
                name: 'Microfrontend',
                boxLow: 0,
                boxHeight: 0,
                value: p.value,
              }))}
              dataKey="value"
              name="MFE runs"
              fill="#3b82f6"
              opacity={0.5}
            >
              <ZAxis range={[15, 15]} />
            </Scatter>
          )}
          {monolithScatter.length > 0 && (
            <Scatter
              data={monolithScatter.map((p) => ({
                name: 'Monolith',
                boxLow: 0,
                boxHeight: 0,
                value: p.value,
              }))}
              dataKey="value"
              name="Monolith runs"
              fill="#a855f7"
              opacity={0.5}
            >
              <ZAxis range={[15, 15]} />
            </Scatter>
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

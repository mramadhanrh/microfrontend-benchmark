import type {
  BenchmarkResult,
  BenchmarkSummary,
  MetricSummary,
  TTestTable,
} from './types/benchmarks';

const calculateMean = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

const calculateMedian = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    const prevSorted = sorted[mid - 1] ?? 0;
    const midSorted = sorted[mid] ?? 0;

    return (prevSorted + midSorted) / 2;
  }
  return sorted[mid] ?? 0;
};

const calculateMode = (values: number[]): number => {
  if (values.length === 0) return 0;

  const frequency = new Map<number, number>();
  let maxFreq = 0;
  let mode = values[0];

  for (const value of values) {
    const freq = (frequency.get(value) || 0) + 1;
    frequency.set(value, freq);

    if (freq > maxFreq) {
      maxFreq = freq;
      mode = value;
    }
  }

  return mode ?? 0;
};

const calculateMin = (values: number[]): number => {
  if (values.length === 0) return 0;
  return Math.min(...values);
};

const calculateMax = (values: number[]): number => {
  if (values.length === 0) return 0;
  return Math.max(...values);
};

const calculateQuartile = (values: number[], quartile: number): number => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * quartile;
  const base = Math.floor(pos);
  const rest = pos - base;

  if (sorted[base + 1] !== undefined) {
    const currentBase = sorted[base] || 0;
    const nextBase = sorted[base + 1] || 0;

    return currentBase + rest * (nextBase - currentBase);
  }
  return sorted[base] ?? 0;
};

const calculateQ1 = (values: number[]): number => {
  return calculateQuartile(values, 0.25);
};

const calculateQ3 = (values: number[]): number => {
  return calculateQuartile(values, 0.75);
};

const defaultEmptyMetric: MetricSummary = {
  mean: 0,
  median: 0,
  mode: 0,
  min: 0,
  max: 0,
  q1: 0,
  q3: 0,
};
const defaultEmptySummary: BenchmarkSummary = {
  speedIndex: defaultEmptyMetric,
  firstContentfulPaint: defaultEmptyMetric,
  largestContentfulPaint: defaultEmptyMetric,
  cumulativeLayoutShift: defaultEmptyMetric,
  timeToInteractive: defaultEmptyMetric,
  totalBlockingTime: defaultEmptyMetric,
};

const BENCHMARK_METRICS: (keyof BenchmarkResult)[] = [
  'speedIndex',
  'firstContentfulPaint',
  'largestContentfulPaint',
  'cumulativeLayoutShift',
  'timeToInteractive',
  'totalBlockingTime',
];

export const getBenchmarkSummary = (
  benchmarkResults: BenchmarkResult[]
): BenchmarkSummary => {
  if (benchmarkResults.length === 0) {
    return defaultEmptySummary;
  }

  const summary: BenchmarkSummary = { ...defaultEmptySummary };

  for (const metric of BENCHMARK_METRICS) {
    const values = benchmarkResults.map((result) => result[metric]);
    summary[metric] = {
      mean: calculateMean(values),
      median: calculateMedian(values),
      mode: calculateMode(values),
      min: calculateMin(values),
      max: calculateMax(values),
      q1: calculateQ1(values),
      q3: calculateQ3(values),
    };
  }

  return summary;
};

export const getBenchmarkTTestTable = (
  benchmarkResults: BenchmarkResult[]
): TTestTable => {
  const table = {} as TTestTable;

  for (const metric of BENCHMARK_METRICS) {
    table[metric] = benchmarkResults.map((result) => result[metric]);
  }

  return table;
};

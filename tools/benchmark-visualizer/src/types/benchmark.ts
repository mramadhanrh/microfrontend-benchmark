export interface BenchmarkResult {
  speedIndex: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  totalBlockingTime: number;
}

export interface MetricSummary {
  mean: number;
  median: number;
  mode: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
}

export interface BenchmarkSummary {
  speedIndex: MetricSummary;
  firstContentfulPaint: MetricSummary;
  largestContentfulPaint: MetricSummary;
  cumulativeLayoutShift: MetricSummary;
  timeToInteractive: MetricSummary;
  totalBlockingTime: MetricSummary;
}

export type TTestTable = {
  [K in keyof BenchmarkResult]: number[];
};

export interface SummaryJson {
  reportVersion: string;
  lighthouseResults: BenchmarkResult[];
  benchmarkSummary: BenchmarkSummary | null;
  benchmarkTTestTable: TTestTable | null;
}

export type MetricKey = keyof BenchmarkResult;

export type ProjectType = 'mfe' | 'monolith';
export type ScenarioType = 'warm' | 'cold';

export interface DataSet {
  project: ProjectType;
  scenario: ScenarioType;
  data: SummaryJson | null;
}

export const METRIC_KEYS: MetricKey[] = [
  'speedIndex',
  'firstContentfulPaint',
  'largestContentfulPaint',
  'cumulativeLayoutShift',
  'timeToInteractive',
  'totalBlockingTime',
];

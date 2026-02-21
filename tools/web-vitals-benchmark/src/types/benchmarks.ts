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

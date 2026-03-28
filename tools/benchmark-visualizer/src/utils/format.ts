import type { MetricKey } from '../types/benchmark';

export function formatMs(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}s`;
  }
  return `${Math.round(value)}ms`;
}

export function formatNumber(value: number, decimals = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

const METRIC_DISPLAY_NAMES: Record<MetricKey, string> = {
  speedIndex: 'Speed Index',
  firstContentfulPaint: 'First Contentful Paint',
  largestContentfulPaint: 'Largest Contentful Paint',
  cumulativeLayoutShift: 'Cumulative Layout Shift',
  timeToInteractive: 'Time to Interactive',
  totalBlockingTime: 'Total Blocking Time',
};

const METRIC_SHORT_NAMES: Record<MetricKey, string> = {
  speedIndex: 'SI',
  firstContentfulPaint: 'FCP',
  largestContentfulPaint: 'LCP',
  cumulativeLayoutShift: 'CLS',
  timeToInteractive: 'TTI',
  totalBlockingTime: 'TBT',
};

export function formatMetricName(key: MetricKey): string {
  return METRIC_DISPLAY_NAMES[key] ?? key;
}

export function formatMetricShortName(key: MetricKey): string {
  return METRIC_SHORT_NAMES[key] ?? key;
}

// Web Vitals thresholds (in ms, except CLS which is unitless)
// Based on Google's official thresholds
interface Threshold {
  good: number;
  needsImprovement: number;
  unit: 'ms' | 'score';
}

const THRESHOLDS: Partial<Record<MetricKey, Threshold>> = {
  firstContentfulPaint: { good: 1800, needsImprovement: 3000, unit: 'ms' },
  largestContentfulPaint: { good: 2500, needsImprovement: 4000, unit: 'ms' },
  cumulativeLayoutShift: { good: 0.1, needsImprovement: 0.25, unit: 'score' },
  speedIndex: { good: 3400, needsImprovement: 5800, unit: 'ms' },
  timeToInteractive: { good: 3800, needsImprovement: 7300, unit: 'ms' },
  totalBlockingTime: { good: 200, needsImprovement: 600, unit: 'ms' },
};

export type Rating = 'good' | 'needs-improvement' | 'poor';

export function getRating(metric: MetricKey, value: number): Rating {
  const threshold = THRESHOLDS[metric];
  if (!threshold) return 'good';
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
}

export function getRatingColor(rating: Rating): string {
  switch (rating) {
    case 'good':
      return '#22c55e';
    case 'needs-improvement':
      return '#f59e0b';
    case 'poor':
      return '#ef4444';
  }
}

export function getRatingBgClass(rating: Rating): string {
  switch (rating) {
    case 'good':
      return 'bg-green-500/10 border-green-500/30 text-green-400';
    case 'needs-improvement':
      return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    case 'poor':
      return 'bg-red-500/10 border-red-500/30 text-red-400';
  }
}

export function formatMetricValue(metric: MetricKey, value: number): string {
  if (metric === 'cumulativeLayoutShift') {
    return value.toFixed(4);
  }
  return formatMs(value);
}

export function percentDifference(a: number, b: number): string {
  if (b === 0) return 'N/A';
  const diff = ((a - b) / b) * 100;
  const sign = diff > 0 ? '+' : '';
  return `${sign}${diff.toFixed(1)}%`;
}

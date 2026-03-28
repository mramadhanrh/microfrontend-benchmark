/**
 * Welch's two-sample t-test (does not assume equal variances).
 * Suitable for benchmark comparison where sample sizes/variances may differ.
 */

export interface TTestResult {
  tStatistic: number;
  pValue: number;
  degreesOfFreedom: number;
  significant: boolean; // p < 0.05
  meanDifference: number;
}

function mean(arr: number[]): number {
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function variance(arr: number[]): number {
  const m = mean(arr);
  return arr.reduce((s, v) => s + (v - m) ** 2, 0) / (arr.length - 1);
}

/**
 * Approximation of the regularized incomplete beta function
 * using a continued fraction representation (Lentz's algorithm).
 * Used internally to compute the CDF of the t-distribution.
 */
function incompleteBeta(x: number, a: number, b: number): number {
  if (x === 0 || x === 1) return x;

  const lnBeta = lgamma(a) + lgamma(b) - lgamma(a + b);
  const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lnBeta) / a;

  // Lentz's continued fraction
  let f = 1;
  let c = 1;
  let d = 1 - ((a + b) * x) / (a + 1);
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1 / d;
  f = d;

  for (let i = 1; i <= 200; i++) {
    const m = i;
    // even step
    let numerator = (m * (b - m) * x) / ((a + 2 * m - 1) * (a + 2 * m));
    d = 1 + numerator * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + numerator / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    f *= d * c;

    // odd step
    numerator = -((a + m) * (a + b + m) * x) / ((a + 2 * m) * (a + 2 * m + 1));
    d = 1 + numerator * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + numerator / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    const delta = d * c;
    f *= delta;

    if (Math.abs(delta - 1) < 1e-10) break;
  }

  return front * f;
}

/**
 * Log-gamma function (Lanczos approximation)
 */
function lgamma(x: number): number {
  const g = 7;
  const coef = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];

  if (x < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
  }

  x -= 1;
  let a = coef[0];
  const t = x + g + 0.5;
  for (let i = 1; i < g + 2; i++) {
    a += coef[i] / (x + i);
  }

  return (
    0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a)
  );
}

/**
 * CDF of the t-distribution using the regularized incomplete beta function.
 */
function tCDF(t: number, df: number): number {
  const x = df / (df + t * t);
  const ib = incompleteBeta(x, df / 2, 0.5);
  return t >= 0 ? 1 - 0.5 * ib : 0.5 * ib;
}

/**
 * Perform Welch's two-sample t-test.
 * Returns t-statistic, p-value (two-tailed), degrees of freedom, and significance.
 */
export function welchTTest(sample1: number[], sample2: number[]): TTestResult {
  const n1 = sample1.length;
  const n2 = sample2.length;
  const m1 = mean(sample1);
  const m2 = mean(sample2);
  const v1 = variance(sample1);
  const v2 = variance(sample2);

  const se1 = v1 / n1;
  const se2 = v2 / n2;
  const seSum = se1 + se2;

  if (seSum === 0) {
    return {
      tStatistic: 0,
      pValue: 1,
      degreesOfFreedom: n1 + n2 - 2,
      significant: false,
      meanDifference: m1 - m2,
    };
  }

  const t = (m1 - m2) / Math.sqrt(seSum);

  // Welch-Satterthwaite degrees of freedom
  const df = seSum ** 2 / (se1 ** 2 / (n1 - 1) + se2 ** 2 / (n2 - 1));

  // Two-tailed p-value
  const pValue = 2 * (1 - tCDF(Math.abs(t), df));

  return {
    tStatistic: t,
    pValue,
    degreesOfFreedom: df,
    significant: pValue < 0.05,
    meanDifference: m1 - m2,
  };
}

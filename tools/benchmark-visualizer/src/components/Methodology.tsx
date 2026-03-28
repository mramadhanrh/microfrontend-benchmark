export default function Methodology() {
  return (
    <section className="bg-surface-2 rounded-xl border border-neutral-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Methodology &amp; Metric Definitions
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
        <MetricInfo
          abbr="SI"
          name="Speed Index"
          description="How quickly content is visually displayed during page load. Lower is better."
          threshold="Good: < 3.4s · Needs Improvement: < 5.8s · Poor: ≥ 5.8s"
        />
        <MetricInfo
          abbr="FCP"
          name="First Contentful Paint"
          description="Time until the browser renders the first bit of DOM content (text, image, canvas)."
          threshold="Good: < 1.8s · Needs Improvement: < 3.0s · Poor: ≥ 3.0s"
        />
        <MetricInfo
          abbr="LCP"
          name="Largest Contentful Paint"
          description="Time until the largest content element in the viewport is rendered. Key Core Web Vital."
          threshold="Good: < 2.5s · Needs Improvement: < 4.0s · Poor: ≥ 4.0s"
        />
        <MetricInfo
          abbr="CLS"
          name="Cumulative Layout Shift"
          description="Visual stability — measures unexpected layout shifts. Unitless score, not time."
          threshold="Good: < 0.1 · Needs Improvement: < 0.25 · Poor: ≥ 0.25"
        />
        <MetricInfo
          abbr="TTI"
          name="Time to Interactive"
          description="Time until the page is fully interactive — all event handlers attached and responsive."
          threshold="Good: < 3.8s · Needs Improvement: < 7.3s · Poor: ≥ 7.3s"
        />
        <MetricInfo
          abbr="TBT"
          name="Total Blocking Time"
          description="Sum of time between FCP and TTI where tasks took > 50ms. Indicates main thread blocking."
          threshold="Good: < 200ms · Needs Improvement: < 600ms · Poor: ≥ 600ms"
        />
      </div>

      <div className="mt-6 p-4 bg-surface-1 rounded-lg border border-neutral-800 text-xs text-neutral-400 space-y-2">
        <p>
          <strong className="text-neutral-300">Benchmarking tool:</strong>{' '}
          Lighthouse CI running headless Chrome. Each scenario has multiple
          independent runs to ensure statistical reliability.
        </p>
        <p>
          <strong className="text-neutral-300">Cold vs Warm:</strong> Cold start
          measures performance with an empty browser cache (first-time visitor).
          Warm start measures with a primed cache (returning visitor).
        </p>
        <p>
          <strong className="text-neutral-300">Statistical test:</strong>{' '}
          Welch&apos;s two-sample t-test (α = 0.05, two-tailed) is used for
          comparison. It does not assume equal variances between samples, making
          it more robust when sample sizes differ.
        </p>
        <p>
          <strong className="text-neutral-300">Thresholds:</strong> Based on{' '}
          <a
            href="https://web.dev/performance-scoring/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Google&apos;s Web Vitals
          </a>{' '}
          scoring guidelines.
        </p>
      </div>
    </section>
  );
}

function MetricInfo({
  abbr,
  name,
  description,
  threshold,
}: {
  abbr: string;
  name: string;
  description: string;
  threshold: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs bg-surface-3 px-2 py-0.5 rounded text-neutral-300 border border-neutral-700">
          {abbr}
        </span>
        <span className="font-medium text-white">{name}</span>
      </div>
      <p className="text-neutral-400 text-xs leading-relaxed">{description}</p>
      <p className="text-neutral-600 text-xs">{threshold}</p>
    </div>
  );
}

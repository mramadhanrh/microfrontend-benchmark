interface HeaderProps {
  mfeWarmRuns: number;
  mfeColdRuns: number;
  monolithWarmRuns: number;
  monolithColdRuns: number;
}

export default function Header({
  mfeWarmRuns,
  mfeColdRuns,
  monolithWarmRuns,
  monolithColdRuns,
}: HeaderProps) {
  const totalRuns =
    mfeWarmRuns + mfeColdRuns + monolithWarmRuns + monolithColdRuns;

  return (
    <header className="border-b border-neutral-800 bg-surface-1/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Microfrontend vs Monolith
            </h1>
            <p className="text-sm text-neutral-400 mt-0.5">
              Lighthouse Performance Benchmark Report
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              MFE: {mfeWarmRuns + mfeColdRuns} runs
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Monolith: {monolithWarmRuns + monolithColdRuns} runs
            </div>
            <div className="text-neutral-600">|</div>
            <div>Total: {totalRuns} runs</div>
          </div>
        </div>
      </div>
    </header>
  );
}

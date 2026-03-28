import type { PageInfo } from '../types/benchmark';
import PageSelector from './PageSelector';

interface HeaderProps {
  mfeRuns: number;
  monolithRuns: number;
  totalRuns: number;
  pages: PageInfo[];
  activePage: string;
  onPageChange: (pageId: string) => void;
}

export default function Header({
  mfeRuns,
  monolithRuns,
  totalRuns,
  pages,
  activePage,
  onPageChange,
}: HeaderProps) {
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
              MFE: {mfeRuns} runs
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Monolith: {monolithRuns} runs
            </div>
            <div className="text-neutral-600">|</div>
            <div>Total: {totalRuns} runs</div>
          </div>
        </div>
        {pages.length > 1 && (
          <div className="mt-4 pt-3 border-t border-neutral-800/50">
            <PageSelector
              pages={pages}
              activePage={activePage}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </header>
  );
}

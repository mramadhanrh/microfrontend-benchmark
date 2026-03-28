import { useState, useEffect } from 'react';
import type { SummaryJson } from '../types/benchmark';
import { loadAllBenchmarkData } from '../services/dataLoader';
import Header from '../components/Header';
import ScenarioSection from '../components/ScenarioSection';
import CombinedOverview from '../components/CombinedOverview';
import Methodology from '../components/Methodology';

type Tab = 'warm' | 'cold' | 'combined';

const TABS: { key: Tab; label: string }[] = [
  { key: 'warm', label: 'Warm Start' },
  { key: 'cold', label: 'Cold Start' },
  { key: 'combined', label: 'Combined Overview' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('warm');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    mfeWarm: SummaryJson | null;
    mfeCold: SummaryJson | null;
    monolithWarm: SummaryJson | null;
    monolithCold: SummaryJson | null;
  }>({
    mfeWarm: null,
    mfeCold: null,
    monolithWarm: null,
    monolithCold: null,
  });

  useEffect(() => {
    loadAllBenchmarkData().then((result) => {
      setData(result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-400 text-sm">Loading benchmark data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-0">
      <Header
        mfeWarmRuns={data.mfeWarm?.lighthouseResults.length ?? 0}
        mfeColdRuns={data.mfeCold?.lighthouseResults.length ?? 0}
        monolithWarmRuns={data.monolithWarm?.lighthouseResults.length ?? 0}
        monolithColdRuns={data.monolithCold?.lighthouseResults.length ?? 0}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab navigation */}
        <nav className="flex gap-1 mb-8 bg-surface-1 rounded-lg p-1 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-surface-3 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Active tab content */}
        {activeTab === 'warm' && (
          <ScenarioSection
            scenario="warm"
            mfeData={data.mfeWarm}
            monolithData={data.monolithWarm}
          />
        )}

        {activeTab === 'cold' && (
          <ScenarioSection
            scenario="cold"
            mfeData={data.mfeCold}
            monolithData={data.monolithCold}
          />
        )}

        {activeTab === 'combined' && (
          <CombinedOverview
            mfeWarm={data.mfeWarm}
            mfeCold={data.mfeCold}
            monolithWarm={data.monolithWarm}
            monolithCold={data.monolithCold}
          />
        )}

        {/* Methodology section */}
        <div className="mt-12">
          <Methodology />
        </div>

        {/* Footer */}
        <footer className="mt-8 pb-8 text-center text-xs text-neutral-600">
          Generated from Lighthouse CI benchmark data · Welch&apos;s t-test for
          statistical comparison
        </footer>
      </main>
    </div>
  );
}

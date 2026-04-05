import { useState, useEffect, useMemo, useCallback } from 'react';
import type {
  PageInfo,
  PageBenchmarkData,
  NetworkProfile,
} from '../types/benchmark';
import { NETWORK_PROFILES } from '../types/benchmark';
import { loadManifest, loadAllPagesData } from '../services/dataLoader';
import Header from '../components/Header';
import ScenarioSection from '../components/ScenarioSection';
import CombinedOverview from '../components/CombinedOverview';
import CrossPageComparison from '../components/CrossPageComparison';
import Methodology from '../components/Methodology';

type Tab = 'warm' | 'cold' | 'combined';

const TABS: { key: Tab; label: string }[] = [
  { key: 'warm', label: 'Warm Start' },
  { key: 'cold', label: 'Cold Start' },
  { key: 'combined', label: 'Combined Overview' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('warm');
  const [activePage, setActivePage] = useState('');
  const [activeNetwork, setActiveNetwork] = useState<NetworkProfile>('none');
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [allPagesData, setAllPagesData] = useState<
    Record<string, PageBenchmarkData>
  >({});

  const loadData = useCallback(
    async (pageList: PageInfo[], network: NetworkProfile) => {
      setLoading(true);
      const data = await loadAllPagesData(pageList, network);
      setAllPagesData(data);
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    loadManifest().then(async (manifest) => {
      setPages(manifest.pages);
      if (manifest.pages.length > 0) {
        setActivePage(manifest.pages[0].id);
        await loadData(manifest.pages, activeNetwork);
      } else {
        setLoading(false);
      }
    });
  }, []);

  const handleNetworkChange = useCallback(
    (network: NetworkProfile) => {
      setActiveNetwork(network);
      if (pages.length > 0) {
        loadData(pages, network);
      }
    },
    [pages, loadData]
  );

  const pageData = allPagesData[activePage] ?? {
    mfeWarm: null,
    mfeCold: null,
    monolithWarm: null,
    monolithCold: null,
  };

  const { mfeRuns, monolithRuns, totalRuns } = useMemo(() => {
    let mfe = 0;
    let mono = 0;
    for (const d of Object.values(allPagesData)) {
      mfe +=
        (d.mfeWarm?.lighthouseResults.length ?? 0) +
        (d.mfeCold?.lighthouseResults.length ?? 0);
      mono +=
        (d.monolithWarm?.lighthouseResults.length ?? 0) +
        (d.monolithCold?.lighthouseResults.length ?? 0);
    }
    return { mfeRuns: mfe, monolithRuns: mono, totalRuns: mfe + mono };
  }, [allPagesData]);

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

  const isAllPages = activePage === 'all';

  return (
    <div className="min-h-screen bg-surface-0">
      <Header
        mfeRuns={mfeRuns}
        monolithRuns={monolithRuns}
        totalRuns={totalRuns}
        pages={pages}
        activePage={activePage}
        onPageChange={setActivePage}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Network profile selector */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
            Network:
          </span>
          <nav className="flex gap-1 bg-surface-1 rounded-lg p-1">
            {NETWORK_PROFILES.map((profile) => (
              <button
                key={profile.key}
                onClick={() => handleNetworkChange(profile.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeNetwork === profile.key
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-neutral-500 hover:text-neutral-300 border border-transparent'
                }`}
              >
                {profile.label}
              </button>
            ))}
          </nav>
        </div>

        {isAllPages ? (
          <>
            <CrossPageComparison pages={pages} allPagesData={allPagesData} />
          </>
        ) : (
          <>
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
                mfeData={pageData.mfeWarm}
                monolithData={pageData.monolithWarm}
              />
            )}

            {activeTab === 'cold' && (
              <ScenarioSection
                scenario="cold"
                mfeData={pageData.mfeCold}
                monolithData={pageData.monolithCold}
              />
            )}

            {activeTab === 'combined' && (
              <CombinedOverview
                mfeWarm={pageData.mfeWarm}
                mfeCold={pageData.mfeCold}
                monolithWarm={pageData.monolithWarm}
                monolithCold={pageData.monolithCold}
              />
            )}
          </>
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

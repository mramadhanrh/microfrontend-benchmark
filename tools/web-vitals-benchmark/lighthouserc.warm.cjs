const benchmarkUrl = process.env.NX_BENCHMARK_URL;
const networkProfile = process.env.NX_NETWORK_PROFILE;

const NETWORK_PROFILES = {
  '4g': {
    rttMs: 150,
    throughputKbps: 1638.4,
    uploadThroughputKbps: 675,
    downloadThroughputKbps: 1638.4,
    cpuSlowdownMultiplier: 4,
    requestLatencyMs: 0,
  },
  '3g': {
    rttMs: 300,
    throughputKbps: 700,
    uploadThroughputKbps: 700,
    downloadThroughputKbps: 700,
    cpuSlowdownMultiplier: 4,
    requestLatencyMs: 0,
  },
};

if (networkProfile && !NETWORK_PROFILES[networkProfile]) {
  throw new Error(
    `Unknown NX_NETWORK_PROFILE "${networkProfile}". Valid values: ${Object.keys(
      NETWORK_PROFILES
    ).join(', ')}`
  );
}

module.exports = {
  ci: {
    collect: {
      // Visit the URL twice: first primes the cache, second measures warm performance
      url: [benchmarkUrl, benchmarkUrl],
      numberOfRuns: 5,
      settings: {
        preset: 'desktop',
        chromeFlags:
          '--no-sandbox --disable-dev-shm-usage --disable-gpu --headless=new',
        // Keep cache/storage between navigations for warm start measurement
        disableStorageReset: true,
        ...(networkProfile && {
          throttling: NETWORK_PROFILES[networkProfile],
          throttlingMethod: 'simulate',
        }),
      },
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

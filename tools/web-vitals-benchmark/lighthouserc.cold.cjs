const benchmarkUrl = process.env.NX_BENCHMARK_URL || 'http://13.229.66.196';

module.exports = {
  ci: {
    collect: {
      url: [benchmarkUrl],
      numberOfRuns: 5,
      settings: {
        preset: 'desktop',
        chromeFlags:
          '--no-sandbox --disable-dev-shm-usage --disable-gpu --headless=new',
        disableStorageReset: false,
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

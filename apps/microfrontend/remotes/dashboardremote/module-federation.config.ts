import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'dashboardremote',
  library: { type: 'var', name: 'dashboardremote' },

  exposes: {
    './Module': './src/remote-entry.ts',
  },
};

export default config;

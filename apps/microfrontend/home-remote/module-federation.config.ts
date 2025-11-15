import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'home-remote',
  library: { name: 'homeremote', type: 'var' },
  exposes: {
    './Module': './src/remote-entry.ts',
  },

  shared: () => ({}),
};

export default config;

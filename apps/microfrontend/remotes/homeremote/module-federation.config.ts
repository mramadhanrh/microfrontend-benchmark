import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'homeremote',
  library: { name: 'homeremote', type: 'var' },

  exposes: {
    './Module': './src/remote-entry.ts',
  },
};

export default config;

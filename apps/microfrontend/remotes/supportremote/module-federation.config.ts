import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'supportremote',
  library: { type: 'var', name: 'supportremote' },

  exposes: {
    './Module': './src/remote-entry.ts',
  },
};

export default config;

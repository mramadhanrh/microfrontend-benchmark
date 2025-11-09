import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'home-remote',

  exposes: {
    './Module': './src/remote-entry.ts',
  },

  shared: () => ({}),
};

export default config;

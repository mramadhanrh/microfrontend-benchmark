import { ModuleFederationConfig } from '@nx/webpack';

const dependencies = {
  '@emotion/react': '11.11.1',
  '@emotion/styled': '11.11.0',
  '@heroicons/react': '^2.2.0',
  '@module-federation/enhanced': '^0.21.3',
  '@radix-ui/react-dropdown-menu': '^2.1.16',
  '@remix-run/node': '^2.8.1',
  '@remix-run/react': '^2.8.1',
  '@remix-run/serve': '^2.8.1',
  axios: '^1.6.8',
  express: '^5.1.0',
  isbot: '^4.4.0',
  react: '18.3.1',
  'react-dom': '18.3.1',
  'react-router-dom': '6.11.2',
  'styled-components': '5.3.6',
  tslib: '^2.3.0',
  zod: '3.25.13',
  zustand: '^4.5.2',
};

const config: ModuleFederationConfig = {
  name: 'loginremote',
  library: { type: 'var', name: 'loginremote' },

  exposes: {
    './Module': './src/remote-entry.ts',
  },

  // shared: (moduleName: string) => {
  //   if (dependencies[moduleName as keyof typeof dependencies]) {
  //     console.log('Shared', {
  //       moduleName,
  //       version: dependencies[moduleName as keyof typeof dependencies],
  //     });
  //     return {
  //       singleton: true,
  //       requiredVersion: dependencies[moduleName as keyof typeof dependencies],
  //     };
  //   }
  // },
};

export default config;

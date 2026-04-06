import { ModuleFederationConfig } from '@nx/webpack';
import { dependencies } from '../../../../package.json';

// Packages that must exist as a single instance at runtime to avoid
// context/state conflicts across microfrontends.
const singletonLibraries = new Set([
  'react',
  'react-dom',
  'react-router-dom',
  'zustand',
]);
const config: ModuleFederationConfig = {
  name: 'supportremote',
  library: { type: 'var', name: 'supportremote' },

  exposes: {
    './Module': './src/remote-entry.ts',
  },

  ...(process.env.NX_OPTIMIZE_MFE !== 'true'
    ? {
        shared: (libraryName, defaultConfig) => {
          if (libraryName === 'react' || libraryName === 'react-dom') {
            return {
              ...defaultConfig,
              singleton: true,
            };
          }

          return defaultConfig;
        },
      }
    : {
        shared: (libraryName, defaultConfig) => {
          if (!(libraryName in dependencies)) {
            // Not a known dependency — do not share
            return false;
          }

          return {
            ...defaultConfig,
            requiredVersion:
              dependencies[libraryName as keyof typeof dependencies],
            singleton: singletonLibraries.has(libraryName),
            // Warn rather than hard-fail when version mismatches occur
            strictVersion: false,
          };
        },
      }),
};

export default config;

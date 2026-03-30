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
  name: 'homeremote',
  library: { name: 'homeremote', type: 'var' },

  exposes: {
    './Module': './src/remote-entry.ts',
  },

  shared: (libraryName, defaultConfig) => {
    if (!(libraryName in dependencies)) {
      // Not a known dependency — do not share
      console.log(
        `Not sharing library: ${libraryName} as it is not a known dependency.`
      );
      return false;
    }

    console.log(
      `Sharing library: ${libraryName} with version ${
        dependencies[libraryName as keyof typeof dependencies]
      }`
    );

    return {
      ...defaultConfig,
      requiredVersion: dependencies[libraryName as keyof typeof dependencies],
      singleton: singletonLibraries.has(libraryName),
      // Warn rather than hard-fail when version mismatches occur
      strictVersion: false,
    };
  },
};

export default config;

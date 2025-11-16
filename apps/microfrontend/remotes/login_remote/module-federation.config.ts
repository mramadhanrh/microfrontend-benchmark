import { ModuleFederationConfig } from '@nx/module-federation';

export const sharedMappings = {
  react: {
    singleton: true,
    strictVersion: false,
    requiredVersion: '18.2.0',
    eager: false,
  },
  'react-dom': {
    singleton: true,
    strictVersion: false,
    requiredVersion: '18.2.0',
    eager: false,
  },
};

const config: ModuleFederationConfig = {
  name: 'login_remote',
  library: { type: 'var', name: 'login_remote' },
  exposes: {
    './Module': './src/remote-entry.ts',
  },
  shared: (libraryName, defaultConfig) => {
    const [packageName] =
      libraryName.includes('@') && !libraryName.startsWith('@')
        ? libraryName.split('@')
        : [libraryName, null];

    // Use shared mappings if available
    if (sharedMappings[packageName as keyof typeof sharedMappings]) {
      console.log(`Applying shared mapping for ${packageName}`);
      return {
        ...defaultConfig,
        ...sharedMappings[packageName as keyof typeof sharedMappings],
      };
    }

    // Default configuration for other libraries
    return defaultConfig;
  },
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;

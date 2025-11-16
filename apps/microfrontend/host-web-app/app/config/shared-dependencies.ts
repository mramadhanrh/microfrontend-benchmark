/**
 * Shared Module Federation Configuration
 *
 * This file centralizes the shared dependencies configuration to ensure
 * consistency between the host and all remotes.
 */

import { ModuleFederation } from '@module-federation/enhanced/runtime';

/**
 * Get the shared dependencies configuration for Module Federation Enhanced Runtime
 * This ensures React and React-DOM are shared as singletons to prevent the
 * "Cannot read properties of null (reading 'useState')" error
 */
export async function getSharedDependencies() {
  // Dynamically import React and React-DOM to make them available for sharing
  const React = await import('react');
  const ReactDOM = await import('react-dom');

  console.log('Shared dependencies loaded:', { React, ReactDOM });
  return {
    react: {
      version: '18.2.0',
      scope: 'default',
      lib: () => React,
      shareConfig: {
        singleton: true,
        requiredVersion: '18.2.0',
      },
    },
    'react-dom': {
      version: '18.2.0',
      scope: 'default',
      lib: () => ReactDOM,
      shareConfig: {
        singleton: true,
        requiredVersion: '18.2.0',
      },
    },
  };
}

/**
 * Shared configuration for Webpack-based remotes (e.g., login_remote)
 * This is used in module-federation.config.ts files
 */
export function getWebpackSharedConfig() {
  return (libraryName: string, defaultConfig: any) => {
    // Share React and React-DOM as singletons to prevent multiple instances
    if (libraryName === 'react' || libraryName === 'react-dom') {
      return {
        ...defaultConfig,
        singleton: true,
        strictVersion: false,
        requiredVersion: false,
        eager: false,
      };
    }

    // Share other common libraries
    if (
      libraryName === 'react-router-dom' ||
      libraryName === '@remix-run/react'
    ) {
      return {
        ...defaultConfig,
        singleton: true,
        strictVersion: false,
        requiredVersion: false,
      };
    }

    return defaultConfig;
  };
}

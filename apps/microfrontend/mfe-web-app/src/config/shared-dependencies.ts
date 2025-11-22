/**
 * Shared Module Federation Configuration
 *
 * This file centralizes the shared dependencies configuration to ensure
 * consistency between the host and all remotes.
 */

import { createInstance } from '@module-federation/enhanced/runtime';
import React from 'react';

type SharedDependencies = Parameters<typeof createInstance>['0']['shared'];

/**
 * Get the shared dependencies configuration for Module Federation Enhanced Runtime
 * This ensures React and React-DOM are shared as singletons to prevent the
 * "Cannot read properties of null (reading 'useState')" error
 */
export function getSharedDependencies(): SharedDependencies {
  // Dynamically import React and React-DOM to make them available for sharing

  return {
    react: {
      scope: 'default',
      version: '18.3.1',
      lib: () => React,
      shareConfig: {
        requiredVersion: '18.3.1',
        singleton: true,
        eager: true,
      },
    },
  };
}

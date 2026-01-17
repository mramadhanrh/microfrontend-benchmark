import { composePlugins, withNx } from '@nx/webpack';
import { withReact } from '@nx/react';
import { withModuleFederation } from '@nx/react/module-federation';
const CompressionPlugin = require('compression-webpack-plugin');

import baseConfig from './module-federation.config';

const config = {
  ...baseConfig,
};

// Nx plugins for webpack to build config object from Nx options and context.
export default composePlugins(
  withNx(),
  withReact(),
  withModuleFederation(config),
  (config) => {
    // Add compression plugin for production builds
    if (config.mode === 'production') {
      config.plugins = config.plugins || [];
      config.plugins.push(
        new CompressionPlugin({
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 1024, // Only compress files larger than 1KB
          minRatio: 0.8,
        })
      );
    }
    return config;
  }
);

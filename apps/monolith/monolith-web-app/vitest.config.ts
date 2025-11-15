/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/monolith/monolith-web-app',

  plugins: [react(), nxViteTsPaths()],

  test: {
    setupFiles: ['test-setup.ts'],
    globals: true,
    cache: {
      dir: '../../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['./tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../coverage/monolith/monolith-web-app',
      provider: 'v8',
    },

    // Mock Module Federation in tests
    alias: {
      'homeRemote/Module': './tests/__mocks__/homeRemote.tsx',
      '@module-federation/enhanced/runtime':
        './tests/__mocks__/moduleFederation.ts',
    },

    // Handle dynamic imports
    deps: {
      inline: [
        '@module-federation/enhanced',
        '@originjs/vite-plugin-federation',
      ],
    },
  },
});

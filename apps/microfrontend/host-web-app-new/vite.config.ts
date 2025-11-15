import { defineConfig } from 'vite';
import { vitePlugin as remix } from '@remix-run/dev';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/microfrontend/host-web-app-new',

  plugins: [
    react(),
    nxViteTsPaths(),
    // federation({
    //   name: 'monolithWebApp',
    //   filename: 'remoteEntry.js',
    //   remotes: {
    //     homeRemote: 'http://localhost:4201/assets/remoteEntry.js',
    //   },
    //   shared: ['react', 'react-dom'],
    // }),
    remix({
      ignoredRouteFiles: ['**/.*'],
      serverBuildFile: 'index.js',
      buildEnd: async () => {
        // Build hook to handle post-build tasks if needed
      },
    }),
  ],

  server: {
    port: 3000,
    fs: {
      allow: ['..', '../../../'],
    },
  },

  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      output: {
        format: 'es',
        minifyInternalExports: false,
      },
      external: (id) => {
        // Mark Module Federation remotes as external for server build
        if (id.includes('homeRemote/')) {
          return true;
        }
        return false;
      },
    },
  },

  optimizeDeps: {
    exclude: ['@module-federation/enhanced'],
  },

  ssr: {
    // Mark Module Federation remotes as noExternal for SSR
    noExternal: ['@module-federation/enhanced'],
  },
});

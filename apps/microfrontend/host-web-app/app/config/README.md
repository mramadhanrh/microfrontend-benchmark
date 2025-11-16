# Shared Dependencies Configuration

## Problem

When loading remote modules in Module Federation, you might encounter this error:

```
TypeError: Cannot read properties of null (reading 'useState')
```

This happens because the remote module is using a **different React instance** than the host application, causing React hooks to fail.

## Solution

Both the **host** and **remote** applications must share the same React instance as a **singleton**.

## Configuration

### For Host Application (Using @module-federation/enhanced)

The host uses the `@module-federation/enhanced/runtime` API. The shared dependencies are configured in:

**File:** `app/config/shared-dependencies.ts`

```typescript
export async function getSharedDependencies() {
  const React = await import('react');
  const ReactDOM = await import('react-dom');

  return {
    react: {
      version: '18.3.1',
      scope: 'default',
      lib: () => React,
      shareConfig: {
        singleton: true,
        requiredVersion: '^18.3.1',
      },
    },
    'react-dom': {
      version: '18.3.1',
      scope: 'default',
      lib: () => ReactDOM,
      shareConfig: {
        singleton: true,
        requiredVersion: '^18.3.1',
      },
    },
  };
}
```

This configuration is automatically applied in `useModuleFederation` and `useMultipleModuleFederation` hooks.

### For Remote Applications (Using Webpack Module Federation)

Remote applications need to configure shared dependencies in their `module-federation.config.ts`:

**File:** `apps/microfrontend/remotes/login_remote/module-federation.config.ts`

```typescript
import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'login_remote',
  exposes: {
    './Module': './src/remote-entry.ts',
  },
  shared: (libraryName, defaultConfig) => {
    // Share React and React-DOM as singletons
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
    if (libraryName === 'react-router-dom' || libraryName === '@remix-run/react') {
      return {
        ...defaultConfig,
        singleton: true,
        strictVersion: false,
        requiredVersion: false,
      };
    }

    return defaultConfig;
  },
};

export default config;
```

## Key Points

### Singleton Configuration

- **`singleton: true`** - Ensures only ONE instance of React exists across host and all remotes
- **`strictVersion: false`** - Allows different versions to work together (use with caution)
- **`requiredVersion: false`** - Doesn't enforce a specific version requirement
- **`eager: false`** - Loads the shared module on-demand (not at startup)

### Why This Works

1. **Host loads React first** - When the host application initializes, it loads React and React-DOM
2. **Host shares React instance** - Module Federation makes this instance available to remotes
3. **Remote uses host's React** - When the remote loads, it uses the shared React instance instead of bundling its own
4. **Hooks work correctly** - Since there's only one React instance, hooks work as expected

## Testing

After applying these changes:

1. **Rebuild the remote:**

   ```bash
   nx build login_remote
   ```

2. **Restart the remote dev server:**

   ```bash
   nx serve login_remote
   ```

3. **Restart the host dev server:**

   ```bash
   nx serve host-web-app
   ```

4. **Test the route:**
   Navigate to `http://localhost:4200/login` and verify the remote loads without errors.

## Debugging

If you still encounter issues:

1. **Check the browser console** for Module Federation logs
2. **Verify versions match** - Ensure React versions are compatible
3. **Clear cache** - Stop servers, clear `node_modules/.cache`, restart
4. **Check network tab** - Verify `remoteEntry.js` is loading correctly
5. **Inspect shared modules** - Check if React is marked as shared in both host and remote

## Common Libraries to Share

Besides React, consider sharing these libraries as singletons:

```typescript
// In module-federation.config.ts
shared: (libraryName, defaultConfig) => {
  const singletons = ['react', 'react-dom', 'react-router-dom', '@remix-run/react', 'styled-components', 'zustand'];

  if (singletons.includes(libraryName)) {
    return {
      ...defaultConfig,
      singleton: true,
      strictVersion: false,
      requiredVersion: false,
    };
  }

  return defaultConfig;
};
```

## Version Compatibility

Current configuration:

- React: `18.3.1`
- React-DOM: `18.3.1`

If you upgrade React versions, update:

1. `package.json` in both host and remotes
2. `app/config/shared-dependencies.ts` (version number)
3. Rebuild all applications

## Additional Resources

- [Module Federation Shared API](https://module-federation.io/configure/shared.html)
- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)
- [@module-federation/enhanced](https://github.com/module-federation/core)

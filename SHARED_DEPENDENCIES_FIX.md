# Fix: React useState Error in Module Federation

## Problem Identified ✅

**Error Message:**

```
TypeError: Cannot read properties of null (reading 'useState')
```

**Root Cause:** The remote module (login_remote) was using a different React instance than the host application, causing React hooks to fail.

## Solution Implemented ✅

### 1. Updated Remote Configuration

**File:** `apps/microfrontend/remotes/login_remote/module-federation.config.ts`

Added shared dependencies configuration to ensure React is shared as a singleton:

```typescript
shared: (libraryName, defaultConfig) => {
  if (libraryName === 'react' || libraryName === 'react-dom') {
    return {
      ...defaultConfig,
      singleton: true,
      strictVersion: false,
      requiredVersion: false,
      eager: false,
    };
  }
  return defaultConfig;
};
```

### 2. Created Shared Dependencies Config

**File:** `apps/microfrontend/host-web-app/app/config/shared-dependencies.ts`

Centralized shared dependencies configuration for the host:

```typescript
export async function getSharedDependencies() {
  const React = await import('react');
  const ReactDOM = await import('react-dom');

  return {
    react: {
      /* singleton config */
    },
    'react-dom': {
      /* singleton config */
    },
  };
}
```

### 3. Updated Hooks

**File:** `apps/microfrontend/host-web-app/app/hooks/useModuleFederation.ts`

Both `useModuleFederation` and `useMultipleModuleFederation` now:

- Import the shared dependencies helper
- Apply shared configuration during initialization
- Ensure React is loaded as a singleton

## Next Steps 🚀

To apply these fixes:

### 1. Rebuild the Remote

```bash
# Stop the login_remote if it's running
nx build login_remote

# Or restart the dev server
nx serve login_remote
```

### 2. Restart the Host

```bash
# Stop the host-web-app if it's running
# Then start it again
nx serve host-web-app
```

### 3. Test

Navigate to `http://localhost:4200/login` and the error should be gone!

## What Changed

| Component                     | Change                     | Why                                   |
| ----------------------------- | -------------------------- | ------------------------------------- |
| **login_remote config**       | Added `shared` function    | Makes React a singleton in the remote |
| **shared-dependencies.ts**    | New file                   | Centralizes shared config for host    |
| **useModuleFederation hooks** | Import & use shared config | Applies shared deps at runtime        |

## Key Concept

**Singleton Pattern:**

- Only ONE instance of React exists across all modules
- Host loads React first
- Remotes use the host's React instance
- Hooks work because they're using the same React context

## Troubleshooting

If you still see the error after rebuilding:

1. **Clear cache:**

   ```bash
   rm -rf node_modules/.cache
   rm -rf dist
   ```

2. **Rebuild everything:**

   ```bash
   nx reset
   nx build login_remote
   nx serve host-web-app
   nx serve login_remote
   ```

3. **Check versions:**

   - Host package.json: `"react": "18.3.1"`
   - Remote package.json: `"react": "18.3.1"`
   - Both should match!

4. **Verify in browser:**
   - Open DevTools → Network tab
   - Check that `remoteEntry.js` loads successfully
   - Look for "Initializing Module Federation" in console

## Documentation

Full documentation available in:

- `app/config/README.md` - Shared dependencies guide
- `app/hooks/README.md` - Hook usage
- `app/components/README.md` - Component usage

## Files Modified

```
✅ apps/microfrontend/remotes/login_remote/module-federation.config.ts
✅ apps/microfrontend/host-web-app/app/config/shared-dependencies.ts (new)
✅ apps/microfrontend/host-web-app/app/hooks/useModuleFederation.ts
✅ apps/microfrontend/host-web-app/app/config/README.md (new)
```

All changes are TypeScript error-free and ready to use! ✨

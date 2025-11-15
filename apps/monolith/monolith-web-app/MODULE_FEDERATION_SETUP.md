# Module Federation Enhanced Setup - Remix

## Files Created/Modified

### 1. Configuration Files

- ✅ `vite.config.ts` - Module Federation configuration for Vite
- ✅ `vitest.config.ts` - Updated with Module Federation mocks
- ✅ `module-federation.d.ts` - TypeScript declarations

### 2. Mock Files (for testing)

- ✅ `tests/__mocks__/homeRemote.tsx` - Mock remote component
- ✅ `tests/__mocks__/moduleFederation.ts` - Mock MF runtime
- ✅ `test-setup.ts` - Updated with MF mocks

### 3. Example Route

- ✅ `app/routes/module-federation.tsx` - Demo page showing both approaches

## Installation Steps

1. **Install dependencies:**

   ```bash
   bun add @module-federation/enhanced
   bun add -D @originjs/vite-plugin-federation
   ```

2. **Update project.json** (if needed):
   ```json
   {
     "targets": {
       "build": {
         "executor": "@nx/vite:build",
         "options": {
           "outputPath": "dist/apps/monolith/monolith-web-app",
           "configFile": "apps/monolith/monolith-web-app/vite.config.ts"
         }
       },
       "serve": {
         "executor": "@nx/vite:dev-server",
         "options": {
           "buildTarget": "monolith-web-app:build",
           "port": 3000
         }
       }
     }
   }
   ```

## Usage

### Option 1: Lazy Loading (Simple)

```typescript
import { lazy, Suspense } from 'react';

const RemoteHome = lazy(() => import('homeRemote/Module'));

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RemoteHome />
    </Suspense>
  );
}
```

### Option 2: Enhanced Runtime API (Advanced)

```typescript
import { init, loadRemote } from '@module-federation/enhanced/runtime';
import { useEffect, useState } from 'react';

export default function Page() {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    init({
      name: 'monolithWebApp',
      remotes: [
        {
          name: 'homeRemote',
          entry: 'http://localhost:4201/assets/remoteEntry.js',
        },
      ],
    });

    loadRemote('homeRemote/Module')
      .then((module) => setComponent(() => module.default))
      .catch((err) => console.error('Failed to load:', err));
  }, []);

  return Component ? <Component /> : <div>Loading...</div>;
}
```

## Running the Apps

1. **Start the remote app (home-remote):**

   ```bash
   nx serve home-remote
   ```

   This will run on http://localhost:4201

2. **Start the Remix app (monolith-web-app):**

   ```bash
   nx serve monolith-web-app
   ```

   This will run on http://localhost:3000

3. **Visit the demo page:**
   ```
   http://localhost:3000/module-federation
   ```

## Testing

Run tests with mocked Module Federation:

```bash
nx test monolith-web-app
```

## Configuration Details

### Exposed Modules

Your Remix app exposes:

- `./HomeModule` -> `./app/routes/_index.tsx`

### Consumed Remotes

Your Remix app can consume:

- `homeRemote` from http://localhost:4201/assets/remoteEntry.js

### Shared Dependencies

- React (singleton)
- React DOM (singleton)
- @remix-run/react (singleton)

## Troubleshooting

1. **Remote not loading:**

   - Make sure the remote app is running on the correct port
   - Check browser console for CORS errors
   - Verify the remote entry URL is correct

2. **TypeScript errors:**

   - Make sure `module-federation.d.ts` is included in your tsconfig
   - Add more module declarations as needed

3. **Tests failing:**
   - Mocks are automatically set up in `test-setup.ts`
   - Use `data-testid="mock-home-remote"` to test with mocks

## Next Steps

1. Install the dependencies
2. Update your project.json if needed
3. Start both apps and test the integration
4. Add more exposed/consumed modules as needed

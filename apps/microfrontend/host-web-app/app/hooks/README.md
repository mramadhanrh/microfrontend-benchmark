# Module Federation Hooks

Reusable React hooks for loading Module Federation remotes in Remix applications.

## Available Hooks

### `useModuleFederation`

Load a single remote module dynamically.

**Parameters:**

- `options: UseModuleFederationOptions` - Configuration object
  - `hostName: string` - Name of the host application
  - `remotes: RemoteConfig[]` - Array of remote configurations
    - `name: string` - Remote name
    - `entry: string` - Remote entry URL
- `moduleName: string` - Module to load (e.g., 'login_remote/Module')

**Returns:**

- `component: T | null` - The loaded component
- `loading: boolean` - Loading state
- `error: string | null` - Error message if loading failed

**Example:**

```tsx
import { useModuleFederation } from '../hooks/useModuleFederation';

function MyComponent() {
  const {
    component: RemoteComponent,
    loading,
    error,
  } = useModuleFederation(
    {
      hostName: 'hostWebApp',
      remotes: [
        {
          name: 'login_remote',
          entry: 'http://localhost:4300/remoteEntry.js',
        },
      ],
    },
    'login_remote/Module'
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!RemoteComponent) return null;

  return <RemoteComponent />;
}
```

### `useMultipleModuleFederation`

Load multiple remote modules simultaneously.

**Parameters:**

- `options: UseModuleFederationOptions` - Configuration object (same as above)
- `moduleNames: string[]` - Array of module names to load

**Returns:**

- `modules: Map<string, T>` - Map of loaded components by module name
- `loading: boolean` - Loading state
- `errors: Map<string, string>` - Map of errors by module name

**Example:**

```tsx
import { useMultipleModuleFederation } from '../hooks/useModuleFederation';

function MyComponent() {
  const { modules, loading, errors } = useMultipleModuleFederation(
    {
      hostName: 'hostWebApp',
      remotes: [
        {
          name: 'login_remote',
          entry: 'http://localhost:4300/remoteEntry.js',
        },
        {
          name: 'home_remote',
          entry: 'http://localhost:4201/remoteEntry.js',
        },
      ],
    },
    ['login_remote/Module', 'home_remote/Module']
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {modules.has('login_remote/Module') && (
        <div>
          {(() => {
            const Component = modules.get('login_remote/Module');
            return Component ? <Component /> : null;
          })()}
        </div>
      )}

      {errors.has('home_remote/Module') && <div>Error: {errors.get('home_remote/Module')}</div>}
    </div>
  );
}
```

## Best Practices

### 1. Client-Side Only

Module Federation should only run on the client side in Remix. Wrap your components with a client-side check:

```tsx
export default function Page() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return <div>{isClient ? <RemoteModuleLoader /> : <div>Initializing...</div>}</div>;
}
```

### 2. Error Handling

Always handle loading and error states:

```tsx
function RemoteLoader() {
  const { component, loading, error } = useModuleFederation(config, moduleName);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!component) {
    return <EmptyState />;
  }

  return <component />;
}
```

### 3. Centralize Configuration

Create a configuration file for your remotes:

```tsx
// app/config/remotes.ts
export const REMOTE_CONFIG = {
  hostName: 'hostWebApp',
  remotes: [
    {
      name: 'login_remote',
      entry: process.env.LOGIN_REMOTE_URL || 'http://localhost:4300/remoteEntry.js',
    },
    {
      name: 'home_remote',
      entry: process.env.HOME_REMOTE_URL || 'http://localhost:4201/remoteEntry.js',
    },
  ],
};

// In your component
const { component } = useModuleFederation(REMOTE_CONFIG, 'login_remote/Module');
```

### 4. TypeScript Support

Define types for your remote modules:

```tsx
// app/types/remotes.d.ts
declare module 'login_remote/Module' {
  const Module: React.ComponentType;
  export default Module;
}

declare module 'home_remote/Module' {
  const Module: React.ComponentType;
  export default Module;
}

// Use with the hook
const { component } = useModuleFederation<React.ComponentType>(config, 'login_remote/Module');
```

### 5. Performance Optimization

For multiple remotes, use `useMultipleModuleFederation` to load them in parallel:

```tsx
// ✅ Good - Parallel loading
const { modules } = useMultipleModuleFederation(config, ['remote1/Module', 'remote2/Module', 'remote3/Module']);

// ❌ Bad - Sequential loading
const remote1 = useModuleFederation(config, 'remote1/Module');
const remote2 = useModuleFederation(config, 'remote2/Module');
const remote3 = useModuleFederation(config, 'remote3/Module');
```

## Troubleshooting

### Module not loading

1. Ensure the remote server is running
2. Check the entry URL is correct
3. Verify the module is exposed in the remote's `module-federation.config.ts`
4. Check browser console for detailed error messages

### CORS errors

Ensure your remote server has proper CORS headers configured:

```ts
// In your remote's server config
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}
```

### TypeScript errors

Add type declarations in `module-federation.d.ts`:

```ts
declare module 'remoteName/*' {
  const value: any;
  export default value;
}
```

## Reusable Components

### `RemoteModuleRenderer`

A presentation component that handles rendering of remote modules with built-in states.

**Props:**

- `component: React.ComponentType | null` - The loaded component
- `loading: boolean` - Loading state
- `error: string | null` - Error message
- `loadingComponent?: React.ReactNode` - Custom loading component
- `errorComponent?: (error: string) => React.ReactNode` - Custom error component
- `emptyComponent?: React.ReactNode` - Custom empty state component
- `className?: string` - Additional CSS classes
- `showSuccessIndicator?: boolean` - Show success message (default: true)
- `successMessage?: string` - Custom success message
- `moduleName?: string` - Module name for display

**Example:**

```tsx
const { component, loading, error } = useModuleFederation(config, 'remote/Module');

return <RemoteModuleRenderer component={component} loading={loading} error={error} moduleName="Login Remote" successMessage="✓ Login loaded successfully" />;
```

**With Custom Components:**

```tsx
const CustomLoader = () => <div>Loading with style...</div>;

const CustomError = (error: string) => <div>Error: {error}</div>;

return <RemoteModuleRenderer component={component} loading={loading} error={error} loadingComponent={<CustomLoader />} errorComponent={CustomError} />;
```

### `MultipleRemoteModulesRenderer`

A presentation component for rendering multiple remote modules with configuration.

**Props:**

- `modules: Map<string, React.ComponentType>` - Map of loaded modules
- `loading: boolean` - Loading state
- `errors: Map<string, string>` - Map of errors by module name
- `loadingComponent?: React.ReactNode` - Custom loading component
- `className?: string` - Additional CSS classes
- `showSuccessIndicators?: boolean` - Show success messages (default: true)
- `layout?: 'vertical' | 'horizontal' | 'grid'` - Layout style (default: 'vertical')
- `moduleConfigs?: Array<{ moduleName, displayName, description? }>` - Module configurations

**Example:**

```tsx
const { modules, loading, errors } = useMultipleModuleFederation(config, ['remote1/Module', 'remote2/Module']);

return (
  <MultipleRemoteModulesRenderer
    modules={modules}
    loading={loading}
    errors={errors}
    layout="grid"
    moduleConfigs={[
      {
        moduleName: 'remote1/Module',
        displayName: 'Login',
        description: 'User authentication',
      },
      {
        moduleName: 'remote2/Module',
        displayName: 'Dashboard',
        description: 'Main dashboard',
      },
    ]}
  />
);
```

## Examples

See the following files for complete examples:

- `/app/routes/login.tsx` - Single remote with reusable component
- `/app/routes/module-federation.tsx` - Single remote loading
- `/app/routes/multiple-remotes.tsx` - Multiple remotes with renderer
- `/app/routes/custom-renderer.tsx` - Custom loading/error/empty states

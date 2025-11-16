# RemoteModuleRenderer Component

Reusable presentation components for rendering Module Federation remotes with automatic state handling.

## Components

### `RemoteModuleRenderer`

Renders a single remote module with loading, error, and empty states.

### `MultipleRemoteModulesRenderer`

Renders multiple remote modules with flexible layouts and configurations.

## Basic Usage

### Single Remote Module

```tsx
import { useModuleFederation } from '../hooks/useModuleFederation';
import { RemoteModuleRenderer } from '../components/RemoteModuleRenderer';

function MyComponent() {
  const { component, loading, error } = useModuleFederation(
    {
      hostName: 'hostWebApp',
      remotes: {
        name: 'login_remote',
        entry: 'http://localhost:4300/remoteEntry.js',
      },
    },
    'login_remote/Module'
  );

  return <RemoteModuleRenderer component={component} loading={loading} error={error} />;
}
```

### Multiple Remote Modules

```tsx
import { useMultipleModuleFederation } from '../hooks/useModuleFederation';
import { MultipleRemoteModulesRenderer } from '../components/RemoteModuleRenderer';

function MyComponent() {
  const { modules, loading, errors } = useMultipleModuleFederation(
    {
      hostName: 'hostWebApp',
      remotes: [
        { name: 'login_remote', entry: 'http://localhost:4300/remoteEntry.js' },
        { name: 'home_remote', entry: 'http://localhost:4201/remoteEntry.js' },
      ],
    },
    ['login_remote/Module', 'home_remote/Module']
  );

  return (
    <MultipleRemoteModulesRenderer
      modules={modules}
      loading={loading}
      errors={errors}
      moduleConfigs={[
        { moduleName: 'login_remote/Module', displayName: 'Login' },
        { moduleName: 'home_remote/Module', displayName: 'Home' },
      ]}
    />
  );
}
```

## Advanced Usage

### Custom Loading Component

```tsx
const CustomLoader = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-pulse">
      <div className="h-4 bg-blue-400 rounded w-32 mb-2"></div>
      <div className="h-4 bg-blue-300 rounded w-24"></div>
    </div>
  </div>
);

<RemoteModuleRenderer component={component} loading={loading} error={error} loadingComponent={<CustomLoader />} />;
```

### Custom Error Component

```tsx
const CustomError = (error: string) => (
  <div className="bg-red-50 border border-red-200 rounded p-4">
    <h3 className="text-red-800 font-bold">Failed to Load</h3>
    <p className="text-red-600">{error}</p>
    <button onClick={() => window.location.reload()}>Retry</button>
  </div>
);

<RemoteModuleRenderer component={component} loading={loading} error={error} errorComponent={CustomError} />;
```

### Custom Empty State

```tsx
const CustomEmpty = () => (
  <div className="text-center p-8">
    <p className="text-gray-500">No module available</p>
  </div>
);

<RemoteModuleRenderer component={component} loading={loading} error={error} emptyComponent={<CustomEmpty />} />;
```

### Hide Success Indicator

```tsx
<RemoteModuleRenderer component={component} loading={loading} error={error} showSuccessIndicator={false} />
```

### Custom Success Message

```tsx
<RemoteModuleRenderer component={component} loading={loading} error={error} successMessage="🎉 Module loaded successfully!" moduleName="Login Remote" />
```

### With Custom Styling

```tsx
<RemoteModuleRenderer component={component} loading={loading} error={error} className="border-2 border-purple-500 rounded-lg p-4" />
```

## Layout Options for Multiple Modules

### Vertical Layout (Default)

```tsx
<MultipleRemoteModulesRenderer
  modules={modules}
  loading={loading}
  errors={errors}
  layout="vertical"
  moduleConfigs={[...]}
/>
```

### Horizontal Layout

```tsx
<MultipleRemoteModulesRenderer
  modules={modules}
  loading={loading}
  errors={errors}
  layout="horizontal"
  moduleConfigs={[...]}
/>
```

### Grid Layout

```tsx
<MultipleRemoteModulesRenderer
  modules={modules}
  loading={loading}
  errors={errors}
  layout="grid"
  moduleConfigs={[...]}
/>
```

## Module Configuration

### With Descriptions

```tsx
<MultipleRemoteModulesRenderer
  modules={modules}
  loading={loading}
  errors={errors}
  moduleConfigs={[
    {
      moduleName: 'login_remote/Module',
      displayName: 'Login Module',
      description: 'Handles user authentication and login flow',
    },
    {
      moduleName: 'home_remote/Module',
      displayName: 'Home Module',
      description: 'Main landing page with hero section',
    },
  ]}
/>
```

### Hide Success Indicators

```tsx
<MultipleRemoteModulesRenderer
  modules={modules}
  loading={loading}
  errors={errors}
  showSuccessIndicators={false}
  moduleConfigs={[...]}
/>
```

## Complete Example

```tsx
import { useEffect, useState } from 'react';
import { useModuleFederation } from '../hooks/useModuleFederation';
import { RemoteModuleRenderer } from '../components/RemoteModuleRenderer';

function LoginPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { component, loading, error } = useModuleFederation(
    {
      hostName: 'hostWebApp',
      remotes: {
        name: 'login_remote',
        entry: 'http://localhost:4300/remoteEntry.js',
      },
    },
    'login_remote/Module'
  );

  return <div className="container mx-auto p-8">{isClient ? <RemoteModuleRenderer component={component} loading={loading} error={error} moduleName="Login Remote" successMessage="✓ Login module ready" className="max-w-md mx-auto" /> : <div>Initializing...</div>}</div>;
}
```

## Props Reference

### RemoteModuleRenderer Props

| Prop                   | Type                                 | Required | Default          | Description             |
| ---------------------- | ------------------------------------ | -------- | ---------------- | ----------------------- |
| `component`            | `React.ComponentType \| null`        | Yes      | -                | The loaded component    |
| `loading`              | `boolean`                            | Yes      | -                | Loading state           |
| `error`                | `string \| null`                     | Yes      | -                | Error message if any    |
| `loadingComponent`     | `React.ReactNode`                    | No       | Default spinner  | Custom loading UI       |
| `errorComponent`       | `(error: string) => React.ReactNode` | No       | Default error UI | Custom error UI         |
| `emptyComponent`       | `React.ReactNode`                    | No       | Default empty UI | Custom empty state      |
| `className`            | `string`                             | No       | `''`             | Additional CSS classes  |
| `showSuccessIndicator` | `boolean`                            | No       | `true`           | Show success message    |
| `successMessage`       | `string`                             | No       | Standard message | Custom success text     |
| `moduleName`           | `string`                             | No       | -                | Module name for display |

### MultipleRemoteModulesRenderer Props

| Prop                    | Type                                   | Required | Default         | Description            |
| ----------------------- | -------------------------------------- | -------- | --------------- | ---------------------- |
| `modules`               | `Map<string, React.ComponentType>`     | Yes      | -               | Loaded modules         |
| `loading`               | `boolean`                              | Yes      | -               | Loading state          |
| `errors`                | `Map<string, string>`                  | Yes      | -               | Errors by module name  |
| `loadingComponent`      | `React.ReactNode`                      | No       | Default spinner | Custom loading UI      |
| `className`             | `string`                               | No       | `''`            | Additional CSS classes |
| `showSuccessIndicators` | `boolean`                              | No       | `true`          | Show success messages  |
| `layout`                | `'vertical' \| 'horizontal' \| 'grid'` | No       | `'vertical'`    | Layout style           |
| `moduleConfigs`         | `Array<ModuleConfig>`                  | No       | `[]`            | Module display configs |

### ModuleConfig Type

```ts
{
  moduleName: string;      // Module identifier (e.g., 'login_remote/Module')
  displayName: string;     // Human-readable name
  description?: string;    // Optional description text
}
```

## Best Practices

1. **Always use client-side check** - Module Federation only works on the client:

   ```tsx
   const [isClient, setIsClient] = useState(false);
   useEffect(() => setIsClient(true), []);

   return isClient ? <RemoteModuleRenderer .../> : <div>Loading...</div>;
   ```

2. **Provide meaningful module names** - Helps with debugging and user experience:

   ```tsx
   <RemoteModuleRenderer moduleName="Login Remote" ... />
   ```

3. **Use custom error components** - Provide actionable feedback:

   ```tsx
   errorComponent={(error) => (
     <ErrorBoundary error={error} onRetry={() => window.location.reload()} />
   )}
   ```

4. **Configure module descriptions** - Improve UX for multiple remotes:

   ```tsx
   moduleConfigs={[
     {
       moduleName: 'login_remote/Module',
       displayName: 'Login',
       description: 'Secure authentication system'
     }
   ]}
   ```

5. **Choose appropriate layouts** - Match your design requirements:
   - `vertical`: Stack modules (mobile-friendly)
   - `horizontal`: Side-by-side (desktop dashboards)
   - `grid`: Responsive grid (galleries, dashboards)

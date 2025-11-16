# Module Federation Quick Reference

## Import

```tsx
import { useModuleFederation, useMultipleModuleFederation, RemoteModuleRenderer, MultipleRemoteModulesRenderer } from '~/module-federation';
```

## Single Remote Pattern

```tsx
function MyComponent() {
  const { component, loading, error } = useModuleFederation(
    {
      hostName: 'hostWebApp',
      remotes: {
        name: 'remote_name',
        entry: 'http://localhost:PORT/remoteEntry.js',
      },
    },
    'remote_name/Module'
  );

  return <RemoteModuleRenderer component={component} loading={loading} error={error} moduleName="Display Name" />;
}
```

## Multiple Remotes Pattern

```tsx
function MyComponent() {
  const { modules, loading, errors } = useMultipleModuleFederation(
    {
      hostName: 'hostWebApp',
      remotes: [
        { name: 'remote1', entry: 'http://localhost:4201/remoteEntry.js' },
        { name: 'remote2', entry: 'http://localhost:4202/remoteEntry.js' },
      ],
    },
    ['remote1/Module', 'remote2/Module']
  );

  return (
    <MultipleRemoteModulesRenderer
      modules={modules}
      loading={loading}
      errors={errors}
      layout="grid"
      moduleConfigs={[
        { moduleName: 'remote1/Module', displayName: 'Remote 1' },
        { moduleName: 'remote2/Module', displayName: 'Remote 2' },
      ]}
    />
  );
}
```

## Custom Loading

```tsx
<RemoteModuleRenderer component={component} loading={loading} error={error} loadingComponent={<div>Custom loading...</div>} />
```

## Custom Error

```tsx
<RemoteModuleRenderer component={component} loading={loading} error={error} errorComponent={(error) => <div>Error: {error}</div>} />
```

## Hide Success Message

```tsx
<RemoteModuleRenderer component={component} loading={loading} error={error} showSuccessIndicator={false} />
```

## Layout Options

```tsx
// Vertical (default)
<MultipleRemoteModulesRenderer layout="vertical" ... />

// Horizontal
<MultipleRemoteModulesRenderer layout="horizontal" ... />

// Grid
<MultipleRemoteModulesRenderer layout="grid" ... />
```

## Client-Side Only (Required for Remix)

```tsx
export default function Page() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return <div>{isClient ? <YourRemoteComponent /> : <div>Initializing...</div>}</div>;
}
```

## Common Remote Configurations

```tsx
// Login Remote
{
  name: 'login_remote',
  entry: 'http://localhost:4300/remoteEntry.js'
}

// Home Remote
{
  name: 'home_remote',
  entry: 'http://localhost:4201/remoteEntry.js'
}

// Dashboard Remote
{
  name: 'dashboard_remote',
  entry: 'http://localhost:4202/remoteEntry.js'
}
```

## Example Pages

- `/login` - Single remote with default styling
- `/module-federation` - Single remote basic example
- `/multiple-remotes` - Multiple remotes with descriptions
- `/custom-renderer` - Custom loading/error/empty states
- `/simplified-import` - Barrel import pattern demo

## Full Documentation

- `/app/hooks/README.md` - Hook documentation
- `/app/components/README.md` - Component documentation
- `IMPLEMENTATION_SUMMARY.md` - Complete implementation guide

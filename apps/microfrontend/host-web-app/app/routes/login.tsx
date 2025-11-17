import { FC } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { useModuleFederation } from '../hooks/useModuleFederation';
import { RemoteModuleRenderer } from '../components/RemoteModuleRenderer';

export const meta: MetaFunction = () => {
  return [
    { title: 'Module Federation Demo' },
    { name: 'description', content: 'Module Federation with Remix' },
  ];
};

// Client-side component that loads the remote using the custom hook
const RemoteModuleLoader: FC = () => {
  const { component, loading, error } = useModuleFederation(
    {
      hostName: 'hostWebApp',
      remotes: {
        name: 'loginremote',
        entry: 'http://localhost:4300/remoteEntry.js',
      },
    },
    'loginremote/Module'
  );

  return (
    <RemoteModuleRenderer
      component={component}
      loading={loading}
      error={error}
      moduleName="Login Remote"
      showSuccessIndicator={false}
    />
  );
};

export default function ModuleFederationPage() {
  return <RemoteModuleLoader />;
}

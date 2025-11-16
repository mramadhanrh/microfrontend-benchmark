import { useEffect, useState } from 'react';
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
function RemoteModuleLoader() {
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

  return (
    <RemoteModuleRenderer
      component={component}
      loading={loading}
      error={error}
      moduleName="Login Remote"
      showSuccessIndicator={false}
    />
  );
}

export default function ModuleFederationPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Module Federation Demo
          </h1>
          <p className="text-gray-300 text-lg">
            This page demonstrates loading remote modules using Module
            Federation with Remix.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Remote Home Module
          </h2>

          {isClient ? (
            <RemoteModuleLoader />
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-white text-lg">Initializing...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

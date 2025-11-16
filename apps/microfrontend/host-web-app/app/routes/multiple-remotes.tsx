import { useEffect, useState } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { useMultipleModuleFederation } from '../hooks/useModuleFederation';
import { MultipleRemoteModulesRenderer } from '../components/RemoteModuleRenderer';

export const meta: MetaFunction = () => {
  return [
    { title: 'Multiple Remotes Demo' },
    {
      name: 'description',
      content: 'Loading multiple Module Federation remotes',
    },
  ];
};

// Client-side component that loads multiple remotes
function MultipleRemotesLoader() {
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

  return (
    <MultipleRemoteModulesRenderer
      modules={modules}
      loading={loading}
      errors={errors}
      layout="vertical"
      moduleConfigs={[
        {
          moduleName: 'login_remote/Module',
          displayName: 'Login Remote',
          description: 'Authentication and login functionality',
        },
        {
          moduleName: 'home_remote/Module',
          displayName: 'Home Remote',
          description: 'Home page with hero slider',
        },
      ]}
    />
  );
}

export default function MultipleRemotesPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Multiple Remotes Demo
          </h1>
          <p className="text-gray-300 text-lg">
            This page demonstrates loading multiple remote modules
            simultaneously using the useMultipleModuleFederation hook.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          {isClient ? (
            <MultipleRemotesLoader />
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

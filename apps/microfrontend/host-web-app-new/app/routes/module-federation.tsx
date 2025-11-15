import { useEffect, useRef, useState } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { init, loadRemote } from '@module-federation/enhanced/runtime';

export const meta: MetaFunction = () => {
  return [
    { title: 'Module Federation Demo' },
    { name: 'description', content: 'Module Federation with Remix' },
  ];
};

// Client-side component that loads the remote
function RemoteModuleLoader() {
  const [RemoteComponent, setRemoteComponent] =
    useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const callOnce = useRef(false);

  useEffect(() => {
    const loadRemoteModule = async () => {
      try {
        if (callOnce.current) return;
        callOnce.current = true;

        // Import the init and loadRemote functions directly
        // const { init, loadRemote } = await import(
        //   '@module-federation/enhanced/runtime'
        // );

        console.log('Module Federation loaded', { init, loadRemote });

        // Initialize Module Federation
        const hostInstance = await init({
          name: 'monolithWebApp',
          remotes: [
            {
              name: 'login_remote',
              entry: 'http://localhost:4301/remoteEntry.js',
            },
          ],
        });

        console.log('Module Federation initialized', { hostInstance });
        const a = await hostInstance.moduleCache;

        // Load the remote module
        const module = await hostInstance.loadRemote<{
          default: React.ComponentType;
        }>('login_remote/Module');

        console.log('Remote module loaded:', module);

        if (module && module.default) {
          console.log('Setting remote component');
          setRemoteComponent(() => module.default);
        } else {
          setError('Remote module loaded but no default export found');
        }
      } catch (err) {
        console.error('Failed to load remote:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load remote module'
        );
      } finally {
        setLoading(false);
      }
    };

    loadRemoteModule();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <span className="ml-4 text-white text-lg">
          Loading remote module...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
        <h3 className="text-red-400 font-semibold mb-2">
          Failed to Load Remote
        </h3>
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  if (!RemoteComponent) {
    return (
      <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4">
        <p className="text-yellow-300">No component loaded</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg">
        <p className="text-green-300">
          ✓ Loaded via Module Federation Runtime API
        </p>
      </div>
      <RemoteComponent />
    </div>
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

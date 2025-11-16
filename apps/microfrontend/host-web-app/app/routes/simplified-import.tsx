import { useEffect, useState } from 'react';
import type { MetaFunction } from '@remix-run/node';
// Simplified import from the module-federation barrel file
import {
  useModuleFederation,
  RemoteModuleRenderer,
} from '../module-federation';

export const meta: MetaFunction = () => {
  return [
    { title: 'Simplified Import Example' },
    { name: 'description', content: 'Using barrel imports for cleaner code' },
  ];
};

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
      successMessage="✓ Loaded using barrel import"
    />
  );
}

export default function SimplifiedImportPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-teal-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Simplified Import Example
          </h1>
          <p className="text-gray-300 text-lg mb-4">
            This example uses the barrel import pattern for cleaner, more
            maintainable code.
          </p>
          <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm">
            <code className="text-green-300">
              import {'{'} useModuleFederation, RemoteModuleRenderer {'}'} from
              '../module-federation';
            </code>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Benefits</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>
                <strong>Single import path</strong> - No need to remember
                multiple file locations
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>
                <strong>Better IDE support</strong> - Auto-complete shows all
                available exports
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>
                <strong>Easier refactoring</strong> - Change internal structure
                without updating imports
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>
                <strong>Cleaner code</strong> - Reduces import clutter at the
                top of files
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Remote Module
          </h2>

          {isClient ? (
            <RemoteModuleLoader />
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-white text-lg">Initializing...</div>
            </div>
          )}
        </div>

        <div className="mt-8 bg-gray-900/50 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-4">Comparison</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-red-300 mb-3">
                ❌ Before (Multiple Imports)
              </h4>
              <pre className="text-sm text-gray-300 bg-gray-900 rounded p-4 overflow-x-auto">
                <code>{`import { useModuleFederation }
  from '../hooks/useModuleFederation';
import { RemoteModuleRenderer }
  from '../components/RemoteModuleRenderer';`}</code>
              </pre>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-green-300 mb-3">
                ✓ After (Single Import)
              </h4>
              <pre className="text-sm text-gray-300 bg-gray-900 rounded p-4 overflow-x-auto">
                <code>{`import {
  useModuleFederation,
  RemoteModuleRenderer
} from '../module-federation';`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

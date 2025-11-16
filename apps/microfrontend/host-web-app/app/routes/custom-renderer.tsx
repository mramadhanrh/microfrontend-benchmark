import { useEffect, useState } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { useModuleFederation } from '../hooks/useModuleFederation';
import { RemoteModuleRenderer } from '../components/RemoteModuleRenderer';

export const meta: MetaFunction = () => {
  return [
    { title: 'Custom Renderer Demo' },
    { name: 'description', content: 'Custom rendering with Module Federation' },
  ];
};

// Custom loading component
const CustomLoader = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    </div>
    <p className="mt-4 text-white font-semibold">Fetching remote module...</p>
    <p className="mt-2 text-gray-400 text-sm">Please wait while we connect</p>
  </div>
);

// Custom error component
const CustomError = (error: string) => (
  <div className="bg-gradient-to-r from-red-900/40 to-pink-900/40 border-2 border-red-500 rounded-xl p-6">
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">
        <svg
          className="w-8 h-8 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-red-300 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-red-200 mb-4">{error}</p>
        <div className="bg-red-950/50 rounded-lg p-3 text-xs text-red-300 font-mono">
          <p>Troubleshooting tips:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Check if the remote server is running</li>
            <li>Verify the entry URL is correct</li>
            <li>Look for CORS errors in the console</li>
          </ul>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  </div>
);

// Custom empty state component
const CustomEmpty = () => (
  <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/50 rounded-xl p-8 text-center">
    <svg
      className="w-16 h-16 mx-auto text-yellow-400 mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
    <h3 className="text-xl font-semibold text-yellow-300 mb-2">
      Module Not Available
    </h3>
    <p className="text-yellow-200">
      The requested module could not be loaded or is not available at this time.
    </p>
  </div>
);

// Component with all custom renderers
function CustomRemoteLoader() {
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
      loadingComponent={<CustomLoader />}
      errorComponent={CustomError}
      emptyComponent={<CustomEmpty />}
      successMessage="✨ Remote module loaded with custom renderer"
    />
  );
}

// Component with no success indicator
function MinimalRemoteLoader() {
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
      className="border-2 border-purple-500/30 rounded-lg p-4"
    />
  );
}

export default function CustomRendererPage() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<'custom' | 'minimal'>('custom');

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Custom Renderer Demo
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            This page demonstrates custom loading, error, and empty states using
            the RemoteModuleRenderer component.
          </p>

          {/* Tab Selector */}
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'custom'
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white/20 text-gray-300 hover:bg-white/30'
              }`}
            >
              Custom Components
            </button>
            <button
              onClick={() => setActiveTab('minimal')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'minimal'
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white/20 text-gray-300 hover:bg-white/30'
              }`}
            >
              Minimal Style
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          {isClient ? (
            <>
              {activeTab === 'custom' ? (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    With Custom Components
                  </h2>
                  <p className="text-gray-400 mb-6">
                    This example uses custom loading spinner, error message, and
                    empty state components.
                  </p>
                  <CustomRemoteLoader />
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    Minimal Style
                  </h2>
                  <p className="text-gray-400 mb-6">
                    This example has no success indicator and uses default
                    states with custom styling.
                  </p>
                  <MinimalRemoteLoader />
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-white text-lg">Initializing...</div>
            </div>
          )}
        </div>

        {/* Code Example */}
        <div className="mt-8 bg-gray-900/50 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-4">
            Example Code
          </h3>
          <pre className="text-sm text-gray-300 overflow-x-auto">
            <code>{`<RemoteModuleRenderer
  component={component}
  loading={loading}
  error={error}
  loadingComponent={<CustomLoader />}
  errorComponent={CustomError}
  emptyComponent={<CustomEmpty />}
  successMessage="✨ Custom success message"
  moduleName="My Module"
  showSuccessIndicator={true}
  className="custom-class"
/>`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

export interface RemoteModuleRendererProps {
  /** The remote component to render */
  component: React.ComponentType | null;
  /** Loading state */
  loading: boolean;
  /** Error message if loading failed */
  error: string | null;
  /** Optional custom loading component */
  loadingComponent?: React.ReactNode;
  /** Optional custom error component */
  errorComponent?: (error: string) => React.ReactNode;
  /** Optional custom empty state component */
  emptyComponent?: React.ReactNode;
  /** Optional wrapper className */
  className?: string;
  /** Show success indicator when loaded */
  showSuccessIndicator?: boolean;
  /** Custom success message */
  successMessage?: string;
  /** Module name for display purposes */
  moduleName?: string;
}

/**
 * Reusable component to render Module Federation remote modules
 * with built-in loading, error, and empty states.
 *
 * @example
 * ```tsx
 * const { component, loading, error } = useModuleFederation(config, 'remote/Module');
 *
 * return (
 *   <RemoteModuleRenderer
 *     component={component}
 *     loading={loading}
 *     error={error}
 *     moduleName="Login Remote"
 *   />
 * );
 * ```
 */
export function RemoteModuleRenderer({
  component: RemoteComponent,
  loading,
  error,
  loadingComponent,
  errorComponent,
  emptyComponent,
  className = '',
  showSuccessIndicator = false,
  successMessage = '✓ Loaded via Module Federation Runtime API',
  moduleName,
}: RemoteModuleRendererProps) {
  // Loading state
  if (loading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <span className="ml-4 text-white text-lg">
          {moduleName ? `Loading ${moduleName}...` : 'Loading remote module...'}
        </span>
      </div>
    );
  }

  // Error state
  if (error) {
    if (errorComponent) {
      return <>{errorComponent(error)}</>;
    }

    return (
      <div
        className={`bg-red-500/20 border border-red-500 rounded-lg p-4 ${className}`}
      >
        <h3 className="text-red-400 font-semibold mb-2">
          {moduleName
            ? `Failed to Load ${moduleName}`
            : 'Failed to Load Remote'}
        </h3>
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  // Empty state
  if (!RemoteComponent) {
    if (emptyComponent) {
      return <>{emptyComponent}</>;
    }

    return (
      <div
        className={`bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 ${className}`}
      >
        <p className="text-yellow-300">
          {moduleName ? `${moduleName} not available` : 'No component loaded'}
        </p>
      </div>
    );
  }

  // Success state
  return (
    <div className={`animate-fadeIn ${className}`}>
      {showSuccessIndicator && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg">
          <p className="text-green-300">{successMessage}</p>
        </div>
      )}
      <RemoteComponent />
    </div>
  );
}

export interface MultipleRemoteModulesRendererProps {
  /** Map of loaded modules */
  modules: Map<string, React.ComponentType>;
  /** Loading state */
  loading: boolean;
  /** Map of errors by module name */
  errors: Map<string, string>;
  /** Optional custom loading component */
  loadingComponent?: React.ReactNode;
  /** Optional wrapper className */
  className?: string;
  /** Show success indicators when loaded */
  showSuccessIndicators?: boolean;
  /** Layout direction */
  layout?: 'vertical' | 'horizontal' | 'grid';
  /** Module display configurations */
  moduleConfigs?: Array<{
    moduleName: string;
    displayName: string;
    description?: string;
  }>;
}

/**
 * Reusable component to render multiple Module Federation remote modules
 * with built-in loading, error, and empty states.
 *
 * @example
 * ```tsx
 * const { modules, loading, errors } = useMultipleModuleFederation(
 *   config,
 *   ['login_remote/Module', 'home_remote/Module']
 * );
 *
 * return (
 *   <MultipleRemoteModulesRenderer
 *     modules={modules}
 *     loading={loading}
 *     errors={errors}
 *     moduleConfigs={[
 *       { moduleName: 'login_remote/Module', displayName: 'Login' },
 *       { moduleName: 'home_remote/Module', displayName: 'Home' }
 *     ]}
 *   />
 * );
 * ```
 */
export function MultipleRemoteModulesRenderer({
  modules,
  loading,
  errors,
  loadingComponent,
  className = '',
  showSuccessIndicators = true,
  layout = 'vertical',
  moduleConfigs = [],
}: MultipleRemoteModulesRendererProps) {
  // Loading state
  if (loading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <span className="ml-4 text-white text-lg">
          Loading remote modules...
        </span>
      </div>
    );
  }

  const layoutClasses = {
    vertical: 'space-y-6',
    horizontal: 'flex space-x-6 overflow-x-auto',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  };

  return (
    <div className={`${layoutClasses[layout]} ${className}`}>
      {moduleConfigs.map(({ moduleName, displayName, description }) => {
        const hasError = errors.has(moduleName);
        const hasModule = modules.has(moduleName);
        const Component = modules.get(moduleName);

        return (
          <div key={moduleName} className="bg-white/5 rounded-xl p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white">
                {displayName}
              </h3>
              {description && (
                <p className="text-gray-400 text-sm mt-1">{description}</p>
              )}
            </div>

            {hasError ? (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
                <p className="text-red-300">{errors.get(moduleName)}</p>
              </div>
            ) : hasModule && Component ? (
              <div className="animate-fadeIn">
                {showSuccessIndicators && (
                  <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg">
                    <p className="text-green-300 text-sm">
                      ✓ Loaded successfully
                    </p>
                  </div>
                )}
                <Component />
              </div>
            ) : (
              <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4">
                <p className="text-yellow-300">Component not available</p>
              </div>
            )}
          </div>
        );
      })}

      {/* Summary section */}
      {moduleConfigs.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
          <h4 className="text-blue-300 font-semibold mb-2">Summary</h4>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>• Total modules: {moduleConfigs.length}</li>
            <li>• Loaded successfully: {modules.size}</li>
            <li>• Failed to load: {errors.size}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import {
  createInstance,
  loadRemote,
  registerShared,
} from '@module-federation/enhanced/runtime';
import { getSharedDependencies } from '../config/shared-dependencies';

export interface RemoteConfig {
  name: string;
  entry: string;
}

export interface UseModuleFederationOptions {
  hostName: string;
  remotes: RemoteConfig[];
}

export interface UseSingleModuleFederationOptions
  extends Omit<UseModuleFederationOptions, 'remotes'> {
  remotes: RemoteConfig;
}

export interface UseModuleFederationResult<T = React.ComponentType> {
  component: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to initialize Module Federation and load a remote module
 *
 * @param options - Configuration for the host and remotes
 * @param moduleName - The module to load (e.g., 'login_remote/Module')
 * @returns Object containing the loaded component, loading state, and error
 *
 * @example
 * ```tsx
 * const { component: LoginModule, loading, error } = useModuleFederation(
 *   {
 *     hostName: 'hostWebApp',
 *     remotes: [
 *       { name: 'login_remote', entry: 'http://localhost:4300/remoteEntry.js' }
 *     ]
 *   },
 *   'login_remote/Module'
 * );
 * ```
 */
export function useModuleFederation<T = React.ComponentType>(
  options: UseSingleModuleFederationOptions,
  moduleName: string
): UseModuleFederationResult<T> {
  const [component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const loadModule = async () => {
      // Prevent multiple initializations
      if (initialized.current) return;
      initialized.current = true;

      try {
        console.log('Initializing Module Federation...', options);

        // Get shared dependencies configuration
        const shared = await getSharedDependencies();

        // Initialize Module Federation with shared dependencies
        const hostInstance = await createInstance({
          name: options.hostName,
          remotes: [options.remotes],
          shared,
        });

        // const sharedConfig = await registerShared(shared);

        console.log('Module Federation initialized', {
          hostInstance,
          // sharedConfig,
        });

        // Log shared React instances for debugging
        if (typeof window !== 'undefined') {
          console.group('🔍 Module Federation Shared Instances');

          // Check global shared scopes
          const sharedScopes = (window as any).__webpack_share_scopes__;
          if (sharedScopes) {
            console.log('All shared scopes:', sharedScopes);
            console.log('Default scope:', sharedScopes.default);

            // Check React specifically
            if (sharedScopes.default?.react) {
              console.log('React shared module:', sharedScopes.default.react);
              console.log(
                'React versions:',
                Object.keys(sharedScopes.default.react)
              );
            }

            // Check React-DOM
            if (sharedScopes.default?.['react-dom']) {
              console.log(
                'React-DOM shared module:',
                sharedScopes.default['react-dom']
              );
              console.log(
                'React-DOM versions:',
                Object.keys(sharedScopes.default['react-dom'])
              );
            }
          }

          // Check host instance shared modules
          console.log('Host shared config:', shared);

          console.groupEnd();
        }

        // Load the remote module
        const module = await hostInstance.loadRemote<{ default: T }>(
          moduleName
        );

        console.log('Remote module loaded:', module);

        if (module && module.default) {
          setComponent(() => module.default);
        } else {
          setError('Remote module loaded but no default export found');
        }
      } catch (err) {
        console.error('Failed to load remote module:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load remote module'
        );
      } finally {
        setLoading(false);
      }
    };

    loadModule();
  }, [options.hostName, moduleName]); // Only re-run if these values change

  return { component, loading, error };
}

/**
 * Custom hook to load multiple remote modules at once
 *
 * @param options - Configuration for the host and remotes
 * @param moduleNames - Array of module names to load
 * @returns Object containing loaded modules, loading state, and errors
 *
 * @example
 * ```tsx
 * const { modules, loading, errors } = useMultipleModuleFederation(
 *   {
 *     hostName: 'hostWebApp',
 *     remotes: [
 *       { name: 'login_remote', entry: 'http://localhost:4300/remoteEntry.js' },
 *       { name: 'home_remote', entry: 'http://localhost:4201/remoteEntry.js' }
 *     ]
 *   },
 *   ['login_remote/Module', 'home_remote/Module']
 * );
 * ```
 */
export function useMultipleModuleFederation<T = React.ComponentType>(
  options: UseModuleFederationOptions,
  moduleNames: string[]
): {
  modules: Map<string, T>;
  loading: boolean;
  errors: Map<string, string>;
} {
  const [modules, setModules] = useState<Map<string, T>>(new Map());
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const initialized = useRef(false);

  useEffect(() => {
    const loadModules = async () => {
      if (initialized.current) return;
      initialized.current = true;

      try {
        console.log('Initializing Module Federation...', options);

        // Get shared dependencies configuration
        const shared = await getSharedDependencies();

        // Initialize Module Federation once with shared dependencies
        const hostInstance = await createInstance({
          name: options.hostName,
          remotes: options.remotes,
          // shared,
        });

        const sharedConfig = registerShared(shared);

        console.log('Module Federation initialized', {
          hostInstance,
          sharedConfig,
        });

        // Load all modules in parallel
        const modulePromises = moduleNames.map(async (moduleName) => {
          try {
            const module = await hostInstance.loadRemote<{ default: T }>(
              moduleName
            );

            if (module && module.default) {
              return { moduleName, component: module.default, error: null };
            } else {
              return {
                moduleName,
                component: null,
                error: 'No default export found',
              };
            }
          } catch (err) {
            return {
              moduleName,
              component: null,
              error: err instanceof Error ? err.message : 'Failed to load',
            };
          }
        });

        const results = await Promise.all(modulePromises);

        // Update state with results
        const newModules = new Map<string, T>();
        const newErrors = new Map<string, string>();

        results.forEach(({ moduleName, component, error }) => {
          if (component) {
            newModules.set(moduleName, component);
          }
          if (error) {
            newErrors.set(moduleName, error);
          }
        });

        setModules(newModules);
        setErrors(newErrors);
      } catch (err) {
        console.error('Failed to initialize Module Federation:', err);
        const errorMsg =
          err instanceof Error ? err.message : 'Initialization failed';
        const newErrors = new Map<string, string>();
        moduleNames.forEach((name) => newErrors.set(name, errorMsg));
        setErrors(newErrors);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [options.hostName, moduleNames.join(',')]); // Re-run if config changes

  return { modules, loading, errors };
}

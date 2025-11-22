import React, { useEffect, useRef, useState } from 'react';
import { createInstance } from '@module-federation/enhanced/runtime';
import { getSharedDependencies } from '../config/shared-dependencies';

export interface RemoteConfig {
  name: string;
  entry: string;
  moduleName: string;
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
        // Get shared dependencies configuration
        const shared = await getSharedDependencies();

        // Initialize Module Federation with shared dependencies
        const hostInstance = await createInstance({
          name: options.hostName,
          remotes: [options.remotes],
          shared,
        });

        console.log('Module Federation instance created', hostInstance);

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
 * @param options - Configuration for the host and remotes. Each remote should include name, entry, and moduleName.
 * @returns Object containing loaded modules (mapped by moduleName), loading state, and errors (mapped by moduleName)
 *
 * @example
 * ```tsx
 * const { modules, loading, errors } = useMultipleModuleFederation({
 *   hostName: 'hostWebApp',
 *   remotes: [
 *     {
 *       name: 'login_remote',
 *       entry: 'http://localhost:4300/remoteEntry.js',
 *       moduleName: 'login_remote/Module'
 *     },
 *     {
 *       name: 'home_remote',
 *       entry: 'http://localhost:4201/remoteEntry.js',
 *       moduleName: 'home_remote/Module'
 *     }
 *   ]
 * });
 *
 * // Access loaded modules
 * const LoginComponent = modules.get('login_remote/Module');
 * const HomeComponent = modules.get('home_remote/Module');
 * ```
 */
export function useMultipleModuleFederation<T = React.ComponentType>(
  options: UseModuleFederationOptions
): {
  modules: Map<string, T>;
  loading: boolean;
  errors: Map<string, string>;
} {
  const [modules, setModules] = useState<Map<string, T>>(new Map());
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    const loadModules = async () => {
      if (initialized.current) return;
      initialized.current = true;

      try {
        // Get shared dependencies configuration
        const shared = await getSharedDependencies();

        // Initialize Module Federation once with shared dependencies
        const hostInstance = await createInstance({
          name: options.hostName,
          remotes: options.remotes,
          shared,
        });

        // Load all modules in parallel
        const modulePromises = options.remotes.map(async (remote) => {
          try {
            const module = await hostInstance.loadRemote<{ default: T }>(
              remote.moduleName
            );

            console.log({ key: remote.name, module });

            if (module && module.default) {
              console.log({
                module,
                moduleDefault: module.default,
              });
              return {
                moduleName: remote.moduleName,
                component: module.default,
                error: null,
              };
            } else {
              return {
                moduleName: remote.moduleName,
                component: null,
                error: 'No default export found',
              };
            }
          } catch (err) {
            return {
              moduleName: remote.moduleName,
              component: null,
              error: err instanceof Error ? err.message : 'Failed to load',
            };
          }
        });

        const results = await Promise.all(modulePromises);
        console.log({ results });

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
        options.remotes.forEach((remote) =>
          newErrors.set(remote.moduleName, errorMsg)
        );
        setErrors(newErrors);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [options.hostName, options.remotes.map((r) => r.moduleName).join(',')]); // Re-run if config changes

  return { modules, loading, errors };
}

/**
 * Module Federation Utilities
 *
 * Reusable hooks and components for loading Module Federation remotes in Remix applications.
 *
 * @module module-federation
 */

// Export hooks
export {
  useModuleFederation,
  useMultipleModuleFederation,
  type RemoteConfig,
  type UseModuleFederationOptions,
  type UseSingleModuleFederationOptions,
  type UseModuleFederationResult,
} from './hooks/useModuleFederation';

// Export components
export {
  RemoteModuleRenderer,
  MultipleRemoteModulesRenderer,
  type RemoteModuleRendererProps,
  type MultipleRemoteModulesRendererProps,
} from './components/RemoteModuleRenderer';

/**
 * Quick Start Examples:
 *
 * @example Single Remote
 * ```tsx
 * import { useModuleFederation, RemoteModuleRenderer } from '~/module-federation';
 *
 * function MyPage() {
 *   const { component, loading, error } = useModuleFederation(
 *     {
 *       hostName: 'hostWebApp',
 *       remotes: { name: 'login_remote', entry: 'http://localhost:4300/remoteEntry.js' }
 *     },
 *     'login_remote/Module'
 *   );
 *
 *   return <RemoteModuleRenderer component={component} loading={loading} error={error} />;
 * }
 * ```
 *
 * @example Multiple Remotes
 * ```tsx
 * import { useMultipleModuleFederation, MultipleRemoteModulesRenderer } from '~/module-federation';
 *
 * function Dashboard() {
 *   const { modules, loading, errors } = useMultipleModuleFederation(
 *     {
 *       hostName: 'hostWebApp',
 *       remotes: [
 *         { name: 'login_remote', entry: 'http://localhost:4300/remoteEntry.js' },
 *         { name: 'home_remote', entry: 'http://localhost:4201/remoteEntry.js' }
 *       ]
 *     },
 *     ['login_remote/Module', 'home_remote/Module']
 *   );
 *
 *   return (
 *     <MultipleRemoteModulesRenderer
 *       modules={modules}
 *       loading={loading}
 *       errors={errors}
 *       layout="grid"
 *       moduleConfigs={[
 *         { moduleName: 'login_remote/Module', displayName: 'Login' },
 *         { moduleName: 'home_remote/Module', displayName: 'Home' }
 *       ]}
 *     />
 *   );
 * }
 * ```
 *
 * @see {@link ./hooks/README.md} for detailed hook documentation
 * @see {@link ./components/README.md} for component documentation
 */

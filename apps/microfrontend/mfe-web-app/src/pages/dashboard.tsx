import { RemoteModuleRenderer } from '../components/RemoteModuleRenderer';
import { useMultipleModuleFederation } from '../hooks/useModuleFederation';

export function Dashboard() {
  const remotes = useMultipleModuleFederation({
    hostName: 'mfeWebApp',
    remotes: [
      {
        name: 'dashboardremote',
        entry:
          process.env.NX_PUBLIC_DASHBOARD_REMOTE ||
          'http://localhost:4203/remoteEntry.js',
        moduleName: 'dashboardremote/Module',
      },
      {
        name: 'supportremote',
        entry:
          process.env.NX_PUBLIC_SUPPORT_REMOTE ||
          'http://localhost:4201/remoteEntry.js',
        moduleName: 'supportremote/Module',
      },
    ],
  });

  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  return (
    <>
      <RemoteModuleRenderer
        component={remotes.modules.get('dashboardremote/Module') || null}
        error={remotes.errors.get('dashboardremote/Module') || null}
        loading={remotes.loading}
      />
      <RemoteModuleRenderer
        component={remotes.modules.get('supportremote/Module') || null}
        error={remotes.errors.get('supportremote/Module') || null}
        loading={remotes.loading}
      />
    </>
  );
}

export default Dashboard;

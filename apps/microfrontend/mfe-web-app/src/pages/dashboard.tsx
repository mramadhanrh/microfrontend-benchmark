import { RemoteModuleRenderer } from '../components/RemoteModuleRenderer';
import { useMultipleModuleFederation } from '../hooks/useModuleFederation';

export function Dashboard() {
  const remotes = useMultipleModuleFederation({
    hostName: 'mfeWebApp',
    remotes: [
      {
        name: 'dashboardremote',
        entry:
          'https://microfrontend-benchmark-public-0021ac26.s3.ap-southeast-1.amazonaws.com/dashboardremote/remoteEntry.js',
        moduleName: 'dashboardremote/Module',
      },
      {
        name: 'supportremote',
        entry:
          'https://microfrontend-benchmark-public-0021ac26.s3.ap-southeast-1.amazonaws.com/supportremote/remoteEntry.js',
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

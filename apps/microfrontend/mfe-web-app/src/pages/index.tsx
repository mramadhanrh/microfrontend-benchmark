import { RemoteModuleRenderer } from '../components/RemoteModuleRenderer';
import { useMultipleModuleFederation } from '../hooks/useModuleFederation';

export function Index() {
  const remotes = useMultipleModuleFederation({
    hostName: 'mfeWebApp',
    remotes: [
      {
        name: 'homeremote',
        entry: 'https://mfebucket.mramadhanrh.com/homeremote/remoteEntry.js',
        moduleName: 'homeremote/Module',
      },
      {
        name: 'supportremote',
        entry: 'https://mfebucket.mramadhanrh.com/supportremote/remoteEntry.js',
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
        component={remotes.modules.get('homeremote/Module') || null}
        error={remotes.errors.get('homeremote/Module') || null}
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

export default Index;

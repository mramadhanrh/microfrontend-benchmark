import { useEffect } from 'react';
import { RemoteModuleRenderer } from '../components/RemoteModuleRenderer';
import { useMultipleModuleFederation } from '../hooks/useModuleFederation';

export function Index() {
  const remotes = useMultipleModuleFederation({
    hostName: 'mfeWebApp',
    remotes: [
      {
        name: 'homeremote',
        entry:
          process.env.NX_PUBLIC_HOME_REMOTE ||
          'http://localhost:4202/remoteEntry.js',
        moduleName: 'homeremote/Module',
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

  useEffect(() => {
    console.log(process.env);
  }, []);

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

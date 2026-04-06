import { RemoteModuleRenderer } from '../components/RemoteModuleRenderer';
import { useMultipleModuleFederation } from '../hooks/useModuleFederation';

export function Login() {
  const remotes = useMultipleModuleFederation({
    hostName: 'mfeWebApp',
    remotes: [
      {
        name: 'loginremote',
        entry:
          process.env.NX_PUBLIC_LOGIN_REMOTE ||
          'http://localhost:4200/remoteEntry.js',
        moduleName: 'loginremote/Module',
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
        component={remotes.modules.get('loginremote/Module') || null}
        error={remotes.errors.get('loginremote/Module') || null}
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

export default Login;

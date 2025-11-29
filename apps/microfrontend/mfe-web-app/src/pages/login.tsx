import { RemoteModuleRenderer } from '../components/RemoteModuleRenderer';
import { useMultipleModuleFederation } from '../hooks/useModuleFederation';

export function Login() {
  const remotes = useMultipleModuleFederation({
    hostName: 'mfeWebApp',
    remotes: [
      {
        name: 'loginremote',
        entry:
          'https://microfrontend-benchmark-public-0021ac26.s3.ap-southeast-1.amazonaws.com/loginremote/remoteEntry.js',
        moduleName: 'loginremote/Module',
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

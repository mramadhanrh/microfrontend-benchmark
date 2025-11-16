import { LoginModule } from '@mfe-benchmark/login-module';
import NxWelcome from './nx-welcome';
import '../styles.css';

export function App() {
  return (
    <div>
      <LoginModule />
      <NxWelcome title="login_remote" />
    </div>
  );
}

export default App;

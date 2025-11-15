import { LoginModule } from '@mfe-benchmark/login-module';
import { SupportModule } from '@mfe-benchmark/support-module';

export default function Index() {
  return (
    <>
      <SupportModule />
      <LoginModule />
    </>
  );
}

import { HomeModule } from '@mfe-benchmark/home-module';
import { SupportModule } from '@mfe-benchmark/support-module';

export default function Index() {
  return (
    <>
      <SupportModule />
      <HomeModule />
    </>
  );
}

import { DashboardModule } from '@mfe-benchmark/dashboard-module';
import { SupportModule } from '@mfe-benchmark/support-module';

export default function Index() {
  return (
    <>
      <SupportModule />
      <DashboardModule />
    </>
  );
}

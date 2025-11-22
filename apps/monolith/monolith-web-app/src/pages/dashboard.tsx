import dynamic from 'next/dynamic';

const DashboardModule = dynamic(
  () =>
    import('@mfe-benchmark/dashboard-module').then(
      (mod) => mod.DashboardModule
    ),
  { ssr: false }
);

const SupportModule = dynamic(
  () =>
    import('@mfe-benchmark/support-module').then((mod) => mod.SupportModule),
  { ssr: false }
);

export function Index() {
  return (
    <>
      <SupportModule />
      <DashboardModule />
    </>
  );
}

export default Index;

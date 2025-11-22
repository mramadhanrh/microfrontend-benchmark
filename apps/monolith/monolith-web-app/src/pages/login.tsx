import dynamic from 'next/dynamic';

const LoginModule = dynamic(
  () => import('@mfe-benchmark/login-module').then((mod) => mod.LoginModule),
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
      <LoginModule />
    </>
  );
}

export default Index;

import dynamic from 'next/dynamic';

const HomeModule = dynamic(
  () => import('@mfe-benchmark/home-module').then((mod) => mod.HomeModule),
  { ssr: false }
);

export function Index() {
  return <HomeModule />;
}

export default Index;

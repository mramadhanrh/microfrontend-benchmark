import { Glob } from 'bun';
import getCoreData from './src/getCoreData';
import type { BenchmarkResult } from './src/types/benchmarks';
import { getBenchmarkSummary } from './src/getBenchmarkSummaries';

const readFiles = async (dir: string, prefix = 'lhr-') => {
  const glob = new Glob('*.{json}');
  const scannedFiles = await Array.fromAsync(glob.scan({ cwd: dir }));
  const filteredFiles = scannedFiles.filter((file) => file.includes(prefix));

  const results: BenchmarkResult[] = [];
  for (const file of filteredFiles) {
    const content = await Bun.file(`${dir}/${file}`).text();
    const json = JSON.parse(content);
    results.push(getCoreData(json));
  }

  return results;
};

const lighthouseResults = await readFiles('./.lighthouseci-mfe');
const benchmarkSummary = getBenchmarkSummary(lighthouseResults);

console.log({ lighthouseResults, benchmarkSummary });

import { Glob } from 'bun';
import { readdir } from 'node:fs/promises';
import getCoreData, { getSpeedIndex } from './src/getCoreData';

const readFiles = async (dir: string, prefix = 'lhr-') => {
  const glob = new Glob('*.{json}');
  const scannedFiles = await Array.fromAsync(glob.scan({ cwd: dir }));
  const filteredFiles = scannedFiles.filter((file) => file.includes(prefix));

  console.log({ filteredFiles, dir });

  const results = [];
  for (const file of filteredFiles) {
    const content = await Bun.file(`${dir}/${file}`).text();
    const json = JSON.parse(content);
    results.push(json);

    console.log('Core Data:', getCoreData(json));
  }
  return results;
};

const lighthouseResults = await readFiles('./.lighthouseci-mfe');

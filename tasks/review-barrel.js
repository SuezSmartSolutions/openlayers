import esMain from 'es-main';
// import fse from 'fs-extra';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
// import {spawn} from 'child_process';
import {walk} from 'walk';

// const isWindows = process.platform.startsWith('win');
const baseDir = dirname(fileURLToPath(import.meta.url));
const sourceDir = path.join(baseDir, '..', 'src/ol');

function getPaths() {
  return new Promise((resolve, reject) => {
    let paths = [];

    const walker = walk(sourceDir);
    walker.on('names', (base, names) => {
      console.log(base);
      console.log(names);
    });
    // walker.on('file', (root, stats, next) => {
    //   const sourcePath = path.join(root, stats.name);
    //   if (sourcePath.endsWith('.js')) {
    //     paths.push(sourcePath);
    //   }
    //   next();
    // });
    // walker.on('errors', () => {
    //   reject(new Error(`Trouble walking ${sourceDir}`));
    // });

    // walker.on('end', () => {
    //   /**
    //    * Windows has restrictions on length of command line, so passing all the
    //    * changed paths to a task will fail if this limit is exceeded.
    //    * To get round this, if this is Windows and there are newer files, just
    //    * pass the sourceDir to the task so it can do the walking.
    //    */
    //   if (isWindows) {
    //     paths = [sourceDir];
    //   }

    //   resolve(paths);
    // });
  });
}

export default async function main() {
  // const paths = await getPaths();
  return await getPaths();
}

if (esMain(import.meta)) {
  main()
    .then(() => {})
    .catch((err) => {
      process.stderr.write(`${err.message}\n`, () => process.exit(1));
    });
}

import path from 'path';

function getPathName() {
  // Extract path name since __dirname is not defined in ES module scope
  const filename = new URL(import.meta.url).pathname;
  const dirname = path.dirname(filename);

  return dirname;
}

export default getPathName;

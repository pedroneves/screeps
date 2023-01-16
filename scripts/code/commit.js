//@ts-check
import fs from 'node:fs';
import path from 'node:path';
import Session from '../../session.json' assert { type: 'json' };
import { sendCode } from '../../screeps-apis/web-api.js';

const readDistDir = ({
  log = (...params) => {},
  distDir = '../../src/dist',
}) => {
  const distUrl = new URL(distDir, import.meta.url);
  log(`Dist URL: ${distUrl.toString()}`);
  const branches = fs.readdirSync(distUrl);
  log(`Branches: ${branches.join(', ')}`);

  const dist = {};

  for (const branch of branches) {
    const branchUrl = new URL(branch, `${distUrl.toString()}/`);
    log(`  Branch: ${branch} (${branchUrl.toString()})`);

    dist.branch = branch;
    dist.modules = {};

    const modules = fs.readdirSync(branchUrl);
    log(`  Modules: ${modules.join(', ')}`);

    for (const module of modules) {
      const moduleName = path.basename(module, '.js');
      const moduleUrl = new URL(module, `${branchUrl.toString()}/`);
      log(`    ${moduleName} ---- ${moduleUrl.toString()}`);

      const moduleCode = fs.readFileSync(moduleUrl).toString();

      dist.modules[moduleName] = moduleCode;
    }
  }

  return dist;
};

console.time('Finished in');
(async () => {
  console.log(`\nCommiting code on dist directory`);

  const code = readDistDir({ log: console.log });

  console.log('\nCommitting...');
  const response = await sendCode(Session.token, JSON.stringify(code));
  console.log('Done ✅\n');

  console.log('---- Response --------------------------------');
  console.log(response);
  console.log('----------------------------------------------\n');
})().then(() => console.timeEnd('Finished in'));

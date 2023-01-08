/**
 * Prints the code stored on Screeps service for a specific branch
 */
import Session from '../session.json' assert { type: 'json' };
import { fetchCode } from '../screeps-apis/web-api.js';

console.time('Finished in');
(async () => {
  const branch = process.argv[2] || 'default';

  console.log(`Fetching code for branch ${branch}`);

  const code = await fetchCode(Session.token);

  console.log('---- Code --------------------------------');
  console.log(code);
  console.log('------------------------------------------');
})().then(() => console.timeEnd('Finished in'));

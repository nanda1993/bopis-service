// `npm run trace` runs YOUR traceability check, tools/trace.mjs, which you build in milestone 7. This wrapper only says something
// kind if it does not exist yet; otherwise it hands everything over to your tool, unchanged. Lab fixture: please leave it alone.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { app } from './lab-state.mjs';

const tool = path.join(app, 'tools', 'trace.mjs');
if (!existsSync(tool)) {
  console.error('tools/trace.mjs does not exist yet: it is the traceability check that you build in milestone 7 (see LAB-GUIDE.md).');
  process.exit(1);
}
const r = spawnSync(process.execPath, [tool, ...process.argv.slice(2)], { cwd: process.cwd(), stdio: 'inherit' });
process.exit(r.status ?? 1);

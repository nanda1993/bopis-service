// `npm run po` prints the product owner's answers to the team's questions. The answers live next to the opened folder
// (hints/product-owner-notes.md), so that Claude Code does not read them by accident while you are still working from the PRD alone.
// Lab fixture: please leave it alone.
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { app, readState, writeState } from './lab-state.mjs';

const file = path.join(path.resolve(app, '..'), 'hints', 'product-owner-notes.md');
if (!existsSync(file)) {
  console.error('The product owner\'s notes were not found. Is the hints/ folder next to bopis-service/? Re-extract the kit zip and keep the folders together.');
  process.exit(1);
}
const state = readState();
state.po = [...(state.po ?? []), new Date().toISOString()];
writeState(state);
console.log(readFileSync(file, 'utf8'));
console.log('(Asked the product owner. If you asked before milestone 3, say so in LAB-LOG.md: that is fine.)');

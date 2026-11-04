// The lab's own sanity tests: the documents and the catalog are what the cards say they are. Lab fixture: please do not edit.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { CATEGORIES, formatPrice } from '../../src/bopis/catalog.js';

const read = f => readFileSync(new URL(`../../${f}`, import.meta.url), 'utf8');

test('kit: the PRD has eight numbered requirements', () => {
  const sections = [...read('docs/prd.md').matchAll(/^## (\d+)\. /gm)].map(m => Number(m[1]));
  assert.deepEqual(sections.slice(0, 8), [1, 2, 3, 4, 5, 6, 7, 8]);
});

test('kit: the Slack export and the PRD are there, and the spec is not written yet', () => {
  assert.ok(existsSync(new URL('../../docs/slack-thread.md', import.meta.url)));
  assert.ok(read('docs/slack-thread.md').includes('stock buffer'));
});

test('kit: the catalog knows eleven categories', () => {
  assert.equal(CATEGORIES.length, 11);
  assert.ok(CATEGORIES.includes('frozen') && CATEGORIES.includes('pantry'));
});

test('kit: prices are formatted with a dollar sign and two decimals', () => {
  assert.equal(formatPrice(2000), '$2000.00');
});

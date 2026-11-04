// Tests for REQ-002 (at most 6 units of one item) in spec/bopis-eligibility.md.
import test from 'node:test';
import assert from 'node:assert/strict';
import { isBopisEligible } from '../../src/bopis/eligibility.js';

const item = { sku: 'T-1', name: 'Test item', category: 'apparel', weightKg: 1, price: 24 };
const stock = 100;

test('REQ-002: a quantity of 6 is eligible', () => {
  assert.equal(isBopisEligible(item, { quantity: 6, storeStock: stock }), true);
});

test('REQ-002: a quantity of 7 is not eligible', () => {
  assert.equal(isBopisEligible(item, { quantity: 7, storeStock: stock }), false);
});

test('REQ-002: a quantity of 5 is eligible', () => {
  assert.equal(isBopisEligible(item, { quantity: 5, storeStock: stock }), true);
});

test('REQ-002: a quantity of 1 is eligible', () => {
  assert.equal(isBopisEligible(item, { quantity: 1, storeStock: stock }), true);
});

test('REQ-002: a much larger quantity is not eligible, however much stock the store has', () => {
  assert.equal(isBopisEligible(item, { quantity: 50, storeStock: 1000 }), false);
  assert.equal(isBopisEligible(item, { quantity: 8, storeStock: 1000 }), false);
});

test('REQ-002: a missing quantity counts as 1 and is eligible', () => {
  assert.equal(isBopisEligible(item, { storeStock: stock }), true);
});

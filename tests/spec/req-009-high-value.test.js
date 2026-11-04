// Tests for REQ-009 (over $2,000 is not eligible, exactly $2,000 is) in spec/bopis-eligibility.md.
import test from 'node:test';
import assert from 'node:assert/strict';
import { isBopisEligible } from '../../src/bopis/eligibility.js';

const item = { sku: 'T-1', name: 'Test item', category: 'electronics', weightKg: 1 };

test('REQ-009: an item priced at $2,001 is not eligible', () => {
  assert.equal(isBopisEligible({ ...item, price: 2001 }, { quantity: 1 }), false);
});

test('REQ-009: an item priced at exactly $2,000 is eligible', () => {
  assert.equal(isBopisEligible({ ...item, price: 2000 }, { quantity: 1 }), true);
});

test('REQ-009: an item priced just over $2,000 is not eligible', () => {
  assert.equal(isBopisEligible({ ...item, price: 2000.01 }, { quantity: 1 }), false);
});

test('REQ-009: an item priced just under $2,000 is eligible', () => {
  assert.equal(isBopisEligible({ ...item, price: 1999.99 }, { quantity: 1 }), true);
});

test('REQ-009: a much more expensive item is not eligible, however much stock the store has', () => {
  assert.equal(isBopisEligible({ ...item, price: 10000 }, { quantity: 1, storeStock: 1000 }), false);
});

test('REQ-009: an item with an ordinary price is eligible', () => {
  assert.equal(isBopisEligible({ ...item, price: 24 }, { quantity: 1 }), true);
});

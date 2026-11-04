// Tests for REQ-001 (store stock buffer of 2 units) in spec/bopis-eligibility.md.
import test from 'node:test';
import assert from 'node:assert/strict';
import { isBopisEligible } from '../../src/bopis/eligibility.js';

const item = { sku: 'T-1', name: 'Test item', category: 'apparel', weightKg: 1, price: 24 };

test('REQ-001: a quantity of 1 with a store stock of 3 is eligible', () => {
  assert.equal(isBopisEligible(item, { quantity: 1, storeStock: 3 }), true);
});

test('REQ-001: a quantity of 1 with a store stock of 2 is not eligible', () => {
  assert.equal(isBopisEligible(item, { quantity: 1, storeStock: 2 }), false);
});

test('REQ-001: a quantity of 4 with a store stock of 6 is eligible', () => {
  assert.equal(isBopisEligible(item, { quantity: 4, storeStock: 6 }), true);
});

test('REQ-001: a quantity of 4 with a store stock of 5 is not eligible', () => {
  assert.equal(isBopisEligible(item, { quantity: 4, storeStock: 5 }), false);
});

test('REQ-001: a store stock equal to the quantity is not eligible', () => {
  assert.equal(isBopisEligible(item, { quantity: 4, storeStock: 4 }), false);
});

test('REQ-001: a store stock of the quantity plus 1 is not eligible', () => {
  assert.equal(isBopisEligible(item, { quantity: 1, storeStock: 2 }), false);
  assert.equal(isBopisEligible(item, { quantity: 4, storeStock: 5 }), false);
});

test('REQ-001: a store stock of the quantity plus 2 is eligible', () => {
  for (const quantity of [1, 2, 4, 6]) {
    assert.equal(isBopisEligible(item, { quantity, storeStock: quantity + 2 }), true, `quantity ${quantity}`);
  }
});

test('REQ-001: a store with no stock is not eligible', () => {
  assert.equal(isBopisEligible(item, { quantity: 1, storeStock: 0 }), false);
});

test('REQ-001: the buffer applies at the largest quantity of 6', () => {
  assert.equal(isBopisEligible(item, { quantity: 6, storeStock: 8 }), true);
  assert.equal(isBopisEligible(item, { quantity: 6, storeStock: 7 }), false);
});

test('REQ-001: a missing store stock does not make an item not eligible', () => {
  assert.equal(isBopisEligible(item, { quantity: 1 }), true);
  assert.equal(isBopisEligible(item), true);
});

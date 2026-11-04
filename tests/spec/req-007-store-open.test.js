// Tests for REQ-007 (pickup only while the store is open) in spec/bopis-eligibility.md.
import test from 'node:test';
import assert from 'node:assert/strict';
import { isBopisEligible } from '../../src/bopis/eligibility.js';

const item = { sku: 'T-1', name: 'Test item', category: 'apparel', weightKg: 1, price: 24 };

test('REQ-007: a closed store with a quantity of 1 and a store stock of 100 is not eligible', () => {
  assert.equal(isBopisEligible(item, { quantity: 1, storeStock: 100, storeOpen: false }), false);
});

test('REQ-007: an open store with a quantity of 1 and a store stock of 100 is eligible', () => {
  assert.equal(isBopisEligible(item, { quantity: 1, storeStock: 100, storeOpen: true }), true);
});

test('REQ-007: a store that is not said to be closed counts as open and is eligible', () => {
  assert.equal(isBopisEligible(item, { quantity: 1, storeStock: 100 }), true);
  assert.equal(isBopisEligible(item), true);
});

test('REQ-007: a closed store is not eligible when no stock information is given', () => {
  assert.equal(isBopisEligible(item, { storeOpen: false }), false);
});

test('REQ-007: nothing is eligible at a closed store, however well the other rules are met', () => {
  const wine = { sku: 'W-1', name: 'Test wine', category: 'alcohol', weightKg: 1, price: 18, ageRestricted: true };
  assert.equal(isBopisEligible(wine, { quantity: 1, storeStock: 1000, ageVerified: true, storeOpen: false }), false);
  assert.equal(isBopisEligible(wine, { quantity: 1, storeStock: 1000, ageVerified: true, storeOpen: true }), true);
});

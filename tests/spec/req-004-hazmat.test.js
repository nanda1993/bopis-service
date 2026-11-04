// Tests for REQ-004 (hazmat items are never eligible) in spec/bopis-eligibility.md.
import test from 'node:test';
import assert from 'node:assert/strict';
import { isBopisEligible } from '../../src/bopis/eligibility.js';

const item = { sku: 'T-1', name: 'Test item', category: 'household', weightKg: 1, price: 24 };

test('REQ-004: an item flagged as hazmat is not eligible', () => {
  assert.equal(isBopisEligible({ ...item, hazmat: true }, { quantity: 1 }), false);
});

test('REQ-004: an item not flagged as hazmat is eligible', () => {
  assert.equal(isBopisEligible(item, { quantity: 1 }), true);
  assert.equal(isBopisEligible({ ...item, hazmat: false }, { quantity: 1 }), true);
});

test('REQ-004: a hazmat item is not eligible however much stock the store has', () => {
  assert.equal(isBopisEligible({ ...item, hazmat: true }, { quantity: 1, storeStock: 1000 }), false);
});

test('REQ-004: a hazmat item is not eligible even when the age has been verified', () => {
  assert.equal(isBopisEligible({ ...item, hazmat: true }, { quantity: 1, ageVerified: true }), false);
});

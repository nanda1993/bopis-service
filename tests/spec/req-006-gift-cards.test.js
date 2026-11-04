// Tests for REQ-006 (gift cards are never eligible) in spec/bopis-eligibility.md.
import test from 'node:test';
import assert from 'node:assert/strict';
import { isBopisEligible } from '../../src/bopis/eligibility.js';

const item = { sku: 'T-1', name: 'Test item', weightKg: 1, price: 50 };

test('REQ-006: an item in the gift-card category priced at $50 is not eligible', () => {
  assert.equal(isBopisEligible({ ...item, category: 'gift-card' }, { quantity: 1 }), false);
});

test('REQ-006: an item in the apparel category priced at $50 is eligible', () => {
  assert.equal(isBopisEligible({ ...item, category: 'apparel' }, { quantity: 1 }), true);
});

test('REQ-006: a gift card is not eligible whatever its price or the store stock', () => {
  for (const price of [1, 50, 500]) {
    assert.equal(isBopisEligible({ ...item, category: 'gift-card', price }, { quantity: 1, storeStock: 1000 }), false, `price ${price}`);
  }
});

test('REQ-006: a gift card is not eligible even when the age has been verified', () => {
  assert.equal(isBopisEligible({ ...item, category: 'gift-card' }, { quantity: 1, ageVerified: true }), false);
});

test('REQ-006: items in other categories that are not perishable are eligible', () => {
  for (const category of ['household', 'electronics', 'pantry']) {
    assert.equal(isBopisEligible({ ...item, category }, { quantity: 1 }), true, category);
  }
});

// Tests for REQ-005 (age-restricted items need an age check recorded at checkout) in spec/bopis-eligibility.md.
import test from 'node:test';
import assert from 'node:assert/strict';
import { isBopisEligible } from '../../src/bopis/eligibility.js';

const wine = { sku: 'W-1', name: 'Test wine', category: 'alcohol', weightKg: 1, price: 18, ageRestricted: true };
const shirt = { sku: 'T-1', name: 'Test item', category: 'apparel', weightKg: 1, price: 24 };

test('REQ-005: an age-restricted item with no age check recorded is not eligible', () => {
  assert.equal(isBopisEligible(wine, { quantity: 1 }), false);
  assert.equal(isBopisEligible(wine, { quantity: 1, ageVerified: false }), false);
});

test('REQ-005: an age-restricted item with an age check recorded is eligible', () => {
  assert.equal(isBopisEligible(wine, { quantity: 1, ageVerified: true }), true);
});

test('REQ-005: an item that is not age-restricted with no age check recorded is eligible', () => {
  assert.equal(isBopisEligible(shirt, { quantity: 1 }), true);
  assert.equal(isBopisEligible({ ...shirt, ageRestricted: false }, { quantity: 1, ageVerified: false }), true);
});

test('REQ-005: an item that is not age-restricted with an age check recorded is eligible', () => {
  assert.equal(isBopisEligible(shirt, { quantity: 1, ageVerified: true }), true);
});

test('REQ-005: an age-restricted item with no age check recorded is not eligible however much stock the store has', () => {
  assert.equal(isBopisEligible(wine, { quantity: 1, storeStock: 1000 }), false);
});

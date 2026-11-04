// Tests for REQ-003 (perishable items) in spec/bopis-eligibility.md. Perishable is decided by category, never by the date on the packet.
import test from 'node:test';
import assert from 'node:assert/strict';
import { isBopisEligible } from '../../src/bopis/eligibility.js';

const ctx = { quantity: 1, storeStock: 100 };
const item = (category, extra = {}) => ({ sku: 'T-1', name: 'Test item', category, weightKg: 1, price: 24, ...extra });

test('REQ-003: a produce item is not eligible', () => {
  assert.equal(isBopisEligible(item('produce'), ctx), false);
});

test('REQ-003: a dairy item with a shelf life of 30 days is not eligible', () => {
  assert.equal(isBopisEligible(item('dairy', { shelfLifeDays: 30 }), ctx), false);
});

test('REQ-003: a meat item is not eligible', () => {
  assert.equal(isBopisEligible(item('meat'), ctx), false);
});

test('REQ-003: a frozen item with a shelf life of 180 days is not eligible', () => {
  assert.equal(isBopisEligible(item('frozen', { shelfLifeDays: 180 }), ctx), false);
});

test('REQ-003: a bakery item is not eligible', () => {
  assert.equal(isBopisEligible(item('bakery'), ctx), false);
});

test('REQ-003: a pantry item with a shelf life of 2 days is eligible', () => {
  assert.equal(isBopisEligible(item('pantry', { shelfLifeDays: 2 }), ctx), true);
});

test('REQ-003: a household item with a shelf life of 3 days is eligible', () => {
  assert.equal(isBopisEligible(item('household', { shelfLifeDays: 3 }), ctx), true);
});

test('REQ-003: a perishable category is not eligible whatever the shelf life says', () => {
  for (const category of ['produce', 'dairy', 'meat', 'frozen', 'bakery']) {
    for (const shelfLifeDays of [undefined, null, 1, 7, 8, 365]) {
      assert.equal(isBopisEligible(item(category, { shelfLifeDays }), ctx), false, `${category}, shelf life ${shelfLifeDays}`);
    }
  }
});

test('REQ-003: a category that is not perishable is eligible whatever the shelf life says', () => {
  for (const category of ['pantry', 'household', 'electronics', 'apparel']) {
    for (const shelfLifeDays of [undefined, null, 1, 7, 8, 365]) {
      assert.equal(isBopisEligible(item(category, { shelfLifeDays }), ctx), true, `${category}, shelf life ${shelfLifeDays}`);
    }
  }
});

test('REQ-003: a perishable item is not eligible even when the store has plenty of stock', () => {
  assert.equal(isBopisEligible(item('dairy'), { quantity: 1, storeStock: 1000 }), false);
  assert.equal(isBopisEligible(item('dairy')), false);
});

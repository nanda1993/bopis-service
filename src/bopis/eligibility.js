// BOPIS (buy online, pick up in store) eligibility. First shipped in sprint 1, changed in sprints 2 and 3.
//
// isBopisEligible(item, ctx) says whether ONE item can be offered for pickup at the customer's chosen store.
//
//   item: { sku, name, category, weightKg, price, shelfLifeDays, hazmat, ageRestricted, supplier_recall }
//         (only sku and category are always present)
//   ctx:  { quantity = 1, storeStock = Infinity, storeOpen = true, ageVerified = false }
//
// It returns true or false. It never throws for a missing field: a missing field counts as "no".

const MAX_QUANTITY = 6;
const STOCK_BUFFER = 2;
const HIGH_VALUE = 2000;
// Perishable is decided by category, never by the date on the packet (frozen counts, pantry does not).
const PERISHABLE_CATEGORIES = new Set(['produce', 'dairy', 'meat', 'frozen', 'bakery']);

export function isBopisEligible(item, ctx = {}) {
  const { quantity = 1, storeStock = Infinity, storeOpen = true, ageVerified = false } = ctx;

  if (!storeOpen) return false;
  if (item.category === 'gift-card') return false;
  if (PERISHABLE_CATEGORIES.has(item.category)) return false; // REQ-003
  if (item.hazmat) return false;
  if (item.ageRestricted && !ageVerified) return false;
  if (quantity > MAX_QUANTITY) return false;
  if (storeStock < quantity + STOCK_BUFFER) return false;
  if (item.price > HIGH_VALUE) return false;
  return true;
}

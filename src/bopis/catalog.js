// Item categories and a few helpers, kept by the catalog team. Not every helper here is used by the eligibility rules.

export const CATEGORIES = [
  'produce', 'dairy', 'meat', 'frozen', 'bakery', 'pantry',
  'household', 'electronics', 'apparel', 'alcohol', 'gift-card',
];

// Sprint 1 spike for the perishable rule. It was never wired in.
export function isPerishable(item) {
  return item.shelfLifeDays != null && item.shelfLifeDays <= 7;
}

export function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

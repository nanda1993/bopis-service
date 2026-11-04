# BOPIS eligibility: spec

Owner: Dana Whitfield
Status: first draft, not yet reviewed by the product owner

This spec says what `isBopisEligible(item, ctx)` must do. It is built from the PRD (v0.3), the Slack export (sprints 2 and 3) and the
drift report (`docs/drift-report.md`). It records what is **wanted**, including what the code does not do yet.

**Conventions.** In every criterion, unless it says otherwise, the item is otherwise eligible: the store is open, the quantity is 1,
the store stock is 100, and the item is not hazmat, not age-restricted, not a gift card, not perishable, weighs 1 kg and costs $24.
"Eligible" means the function returns `true`. "Not eligible" means it returns `false`.

## REQ-001: Store stock buffer

The chosen store must hold at least the quantity wanted plus a buffer of 2 units.

- Given a quantity of 1 and a store stock of 3, when eligibility is checked, then the item is eligible.
- Given a quantity of 1 and a store stock of 2, when eligibility is checked, then the item is not eligible.
- Given a quantity of 4 and a store stock of 6, when eligibility is checked, then the item is eligible.
- Given a quantity of 4 and a store stock of 5, when eligibility is checked, then the item is not eligible.

Source: PRD section 1 (buffer of 3), changed to 2 in Slack, sprint 2, Tuesday. See the first flagged item.

## REQ-002: Maximum quantity

A customer may order at most 6 units of one item for a single pickup.

- Given a quantity of 6, when eligibility is checked, then the item is eligible.
- Given a quantity of 7, when eligibility is checked, then the item is not eligible.

Source: PRD section 2.

## REQ-003: Perishable items

A perishable item is never eligible for pickup, whatever the store stock.

- Given a perishable item, a quantity of 1 and a store stock of 100, when eligibility is checked, then the item is not eligible.
- Given an item that is not perishable, a quantity of 1 and a store stock of 100, when eligibility is checked, then the item is eligible.

Source: PRD section 3. What counts as perishable is not decided: see the second flagged item.

## REQ-004: Hazardous items

An item flagged as hazmat is never eligible for pickup.

- Given an item flagged as hazmat and a quantity of 1, when eligibility is checked, then the item is not eligible.
- Given an item not flagged as hazmat and a quantity of 1, when eligibility is checked, then the item is eligible.

Source: PRD section 4.

## REQ-005: Age-restricted items

An age-restricted item is eligible only when the customer's age has been verified at checkout.

- Given an age-restricted item, a quantity of 1 and age not verified, when eligibility is checked, then the item is not eligible.
- Given an age-restricted item, a quantity of 1 and age verified, when eligibility is checked, then the item is eligible.
- Given an item that is not age-restricted, a quantity of 1 and age not verified, when eligibility is checked, then the item is eligible.

Source: PRD section 5.

## REQ-006: Gift cards

A gift card is never eligible for pickup, because it is delivered digitally.

- Given an item in the gift-card category priced at $50 and a quantity of 1, when eligibility is checked, then the item is not eligible.
- Given an item in the apparel category priced at $50 and a quantity of 1, when eligibility is checked, then the item is eligible.

Source: PRD section 6.

## REQ-007: Store must be open

Pickup is offered only while the chosen store is open for pickup.

- Given the store is closed, a quantity of 1 and a store stock of 100, when eligibility is checked, then the item is not eligible.
- Given the store is open, a quantity of 1 and a store stock of 100, when eligibility is checked, then the item is eligible.

Source: PRD section 7.

## REQ-008: Heavy items

An item heavier than 20 kg is never eligible for pickup.

- Given an item weighing 21 kg and a quantity of 1, when eligibility is checked, then the item is not eligible.
- Given an item weighing exactly 20 kg and a quantity of 1, when eligibility is checked, then the item is eligible.

Source: PRD section 8.

## REQ-009: High-value items

An item priced over $2,000 is never eligible for pickup, and an item priced at exactly $2,000 is eligible.

- Given an item priced at $2,001 and a quantity of 1, when eligibility is checked, then the item is not eligible.
- Given an item priced at exactly $2,000 and a quantity of 1, when eligibility is checked, then the item is eligible.

Source: Slack, sprint 2, Thursday (Mei, fraud team), shipped by Raj. It is in no section of the PRD, and the product owner has not
yet confirmed it.

## Non-goals

Out of scope for this release (PRD section 10):

- Substitutions
- Home delivery
- Pricing and discounts (the high-value requirement only reads an item's price: this spec does not set or change prices)
- Payment

## Flagged: too vague to be requirements, and open questions

None of these is a requirement. Each needs an answer from the product owner before anything is built or tested from it.

1. **Stock buffer: 3 or 2?** The PRD (section 1) says a buffer of 3 units. In Slack (sprint 2, Tuesday) Dana asked for 2 and Raj shipped
   it, and the code uses 2, but the PRD was never updated. This draft follows Slack. *Question: is 2 the final decision, so that the
   PRD is the document that is wrong?*
2. **What counts as perishable?** The PRD (section 3) says "anything that spoils quickly" and defines nothing else. The unused
   `isPerishable` helper in `src/bopis/catalog.js` (a shelf life of 7 days or less) is a sprint 1 spike that nobody agreed to, and the
   catalog also lists categories such as produce, dairy, meat, frozen and bakery. *Questions: is perishable decided by category, by
   shelf life, or by both? If by shelf life, how many days is "quickly"? What happens when the date on the packet and the category
   disagree, or when there is no date?*
3. **"Eligibility checks should be fast."** *Question: how fast, in milliseconds, for how many checks per second, and measured where?*
   The function is a pure function of its two arguments, so there is nothing to test until there is a number.
4. **"Most large items should be excluded."** *Questions: what is "large" (weight, dimensions or category), and what share is "most"?
   Is the 20 kg weight rule the whole of it, or is something else meant?*
5. **"Customers should have a good experience when an item is not eligible."** *Questions: what is a good experience (a message, a
   reason, an alternative)? The function only returns true or false: does anyone need a reason, and does it belong in this service?*
6. **"Items that are risky to hand over should be handled carefully."** *Questions: which items are "risky" (hazmat, age-restricted,
   high-value, others)? What is "carefully": refusing them, or a different handover?*

## Changelog

- 2026-11-04, draft 0.1: first draft by Claude from the PRD (v0.3), the Slack export (sprints 2 and 3) and the drift report. Nine
  requirements and six flagged items. Not yet reviewed by the product owner.

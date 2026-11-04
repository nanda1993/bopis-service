# BOPIS eligibility: spec

Owner: Dana Whitfield
Approved by: Dana Whitfield
Status: draft 0.2, reviewed against the product owner's answers and approved

This spec says what `isBopisEligible(item, ctx)` must do. It is built from the PRD (v0.3), the Slack export (sprints 2 and 3), the
drift report (`docs/drift-report.md`) and the product owner's answers. It records what is **wanted**, including what the code does not
do yet. Where the product owner's answers differ from the PRD, the answers win.

**Conventions.** In every criterion, unless it says otherwise, the item is otherwise eligible: the store is open, the quantity is 1,
the store stock is 100, and the item is in the apparel category (so it is not perishable), is not hazmat, is not age-restricted, is
not a gift card, weighs 1 kg and costs $24. "Eligible" means the function returns `true`. "Not eligible" means it returns `false`.

## REQ-001: Store stock buffer

The chosen store must hold at least the quantity wanted plus a buffer of 2 units.

- Given a quantity of 1 and a store stock of 3, when eligibility is checked, then the item is eligible.
- Given a quantity of 1 and a store stock of 2, when eligibility is checked, then the item is not eligible.
- Given a quantity of 4 and a store stock of 6, when eligibility is checked, then the item is eligible.
- Given a quantity of 4 and a store stock of 5, when eligibility is checked, then the item is not eligible.

Source: PRD section 1 said a buffer of 3. Slack, sprint 2, Tuesday, changed it to 2, and the product owner confirmed in review that
the Slack decision stands: the PRD is the document that was wrong.

## REQ-002: Maximum quantity

A customer may order at most 6 units of one item for a single pickup.

- Given a quantity of 6, when eligibility is checked, then the item is eligible.
- Given a quantity of 7, when eligibility is checked, then the item is not eligible.

Source: PRD section 2.

## REQ-003: Perishable items

An item in the produce, dairy, meat, frozen or bakery category is never eligible for pickup, whatever its shelf life or the store stock.

- Given an item in the produce category, a quantity of 1 and a store stock of 100, when eligibility is checked, then the item is not eligible.
- Given an item in the dairy category with a shelf life of 30 days, a quantity of 1 and a store stock of 100, when eligibility is checked, then the item is not eligible.
- Given an item in the meat category, a quantity of 1 and a store stock of 100, when eligibility is checked, then the item is not eligible.
- Given an item in the frozen category with a shelf life of 180 days, a quantity of 1 and a store stock of 100, when eligibility is checked, then the item is not eligible.
- Given an item in the bakery category, a quantity of 1 and a store stock of 100, when eligibility is checked, then the item is not eligible.
- Given an item in the pantry category with a shelf life of 2 days, a quantity of 1 and a store stock of 100, when eligibility is checked, then the item is eligible.
- Given an item in the household category with a shelf life of 3 days, a quantity of 1 and a store stock of 100, when eligibility is checked, then the item is eligible.

Source: PRD section 3, made precise by the product owner in review. Perishable is decided by category and **not** by the date on the
packet. Frozen counts although a frozen item lasts for months. Pantry items are shelf-stable and do not count, even with a short
date. Every other category is not perishable. The unused `isPerishable` helper in `src/bopis/catalog.js` decides by shelf life, so it
does not say this and must not be reused as it is.

## REQ-004: Hazardous items

An item flagged as hazmat is never eligible for pickup.

- Given an item flagged as hazmat and a quantity of 1, when eligibility is checked, then the item is not eligible.
- Given an item not flagged as hazmat and a quantity of 1, when eligibility is checked, then the item is eligible.

Source: PRD section 4.

## REQ-005: Age-restricted items

An age-restricted item is eligible only when the order has an age check recorded at checkout.

- Given an age-restricted item, a quantity of 1 and no age check recorded at checkout, when eligibility is checked, then the item is not eligible.
- Given an age-restricted item, a quantity of 1 and an age check recorded at checkout, when eligibility is checked, then the item is eligible.
- Given an item that is not age-restricted, a quantity of 1 and no age check recorded, when eligibility is checked, then the item is eligible.

Source: PRD section 5. The product owner made "verified" precise in review: it means an age check recorded at checkout.

## REQ-006: Gift cards

A gift card is never eligible for pickup, because it is delivered digitally.

- Given an item in the gift-card category priced at $50 and a quantity of 1, when eligibility is checked, then the item is not eligible.
- Given an item in the apparel category priced at $50 and a quantity of 1, when eligibility is checked, then the item is eligible.

Source: PRD section 6.

## REQ-007: Store must be open

Pickup is offered only while the chosen store is open for pickup, and nothing is eligible at a store that is not.

- Given the store is closed, a quantity of 1 and a store stock of 100, when eligibility is checked, then the item is not eligible.
- Given the store is open, a quantity of 1 and a store stock of 100, when eligibility is checked, then the item is eligible.

Source: PRD section 7.

## REQ-008: Heavy items

An item heavier than 20 kg is never eligible for pickup.

- Given an item weighing 21 kg and a quantity of 1, when eligibility is checked, then the item is not eligible.
- Given an item weighing exactly 20 kg and a quantity of 1, when eligibility is checked, then the item is eligible.

Source: PRD section 8. The product owner confirmed in review that the limit is 20 kg and is still wanted.

## REQ-009: High-value items

An item priced over $2,000 is never eligible for pickup, and an item priced at exactly $2,000 is eligible.

- Given an item priced at $2,001 and a quantity of 1, when eligibility is checked, then the item is not eligible.
- Given an item priced at exactly $2,000 and a quantity of 1, when eligibility is checked, then the item is eligible.

Source: Slack, sprint 2, Thursday (Mei, fraud team), shipped by Raj. It is in no section of the PRD. The product owner confirmed it in
review: it is the fraud team's rule, and she wants it in the requirements.

## Non-goals

Out of scope for this release (PRD section 10, confirmed by the product owner):

- Substitutions
- Home delivery
- Pricing and discounts (the high-value requirement only reads an item's price: this spec does not set or change prices)
- Payment

Also out of scope for this spec, by the product owner's answers on the vague sentences below:

- The speed of the eligibility check (performance is tracked elsewhere)
- What the customer sees when an item is not eligible (the design team's work)

## Flagged: too vague to be requirements (answered in review)

These sentences of the PRD could not be turned into testable requirements. Each was put to the product owner. None of them is a
requirement, and none has been turned into one.

1. **"Eligibility checks should be fast."** Answer: not a requirement of this feature, performance is tracked elsewhere. Outcome:
   left out, and listed under Non-goals.
2. **"Most large items should be excluded."** Answer: "large" means heavy, and all items over 20 kg are excluded. Outcome: nothing
   new. It is the heavy-item requirement.
3. **"Customers should have a good experience when an item is not eligible."** Answer: that is the design team's work. Outcome: left
   out, and listed under Non-goals.
4. **"Items that are risky to hand over should be handled carefully."** Answer: it meant hazardous and age-restricted items. Outcome:
   nothing new. They are the hazmat and age-restricted requirements.

Two earlier flagged items are also answered. The stock buffer is 2 (the PRD was wrong), and perishable means five categories, not a
date (see the perishable requirement).

**Still open.** The product owner's answers do not say what happens when an item has no weight or no price. Question: should an item
with an unknown weight or price be refused, or offered?

## Changelog

- 2026-11-04, draft 0.1: first draft by Claude from the PRD (v0.3), the Slack export (sprints 2 and 3) and the drift report. Nine
  requirements and six flagged items. Not yet reviewed by the product owner.
- 2026-11-04, draft 0.2: reviewed against the product owner's answers, and approved by Dana Whitfield. Perishable now means the five
  categories produce, dairy, meat, frozen and bakery, and not the date on the packet (pantry and all other categories are not
  perishable). The stock buffer of 2 and the $2,000 rule are confirmed. "Verified" in the age requirement now means an age check
  recorded at checkout. The four vague sentences are answered: two are non-goals and two are covered by existing requirements. One
  question remains open (items with no weight or price).

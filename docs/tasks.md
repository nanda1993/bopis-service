# Task list and implementation plan

Built from `spec/bopis-eligibility.md` (draft 0.2, approved by Dana Whitfield) and `docs/drift-report.md`. Every task cites a
requirement. Tasks are numbered in the order they should happen (the reasons are below the table).

**Already built** (the code does what the spec says, so these get tests only, and a comment with the ID next to the rule):
REQ-001 stock buffer, REQ-002 quantity, REQ-004 hazmat, REQ-005 age-restricted, REQ-006 gift cards, REQ-007 store open,
REQ-009 high-value items.

**Not built** (these need a code task and a test task): REQ-003 perishable items, REQ-008 heavy items.

| Task | Requirement | Files | Notes |
|---|---|---|---|
| 1. Write the tests for the perishable criteria, with names that start with `REQ-003:`. Run them before any code exists and watch them fail | REQ-003 | `tests/spec/req-003-perishable.test.js` (**new**) | Seven criteria, so at least seven tests: produce, dairy (30 days), meat, frozen (180 days) and bakery are not eligible. Pantry (2 days) and household (3 days) are eligible. The tests that refuse must be red first: task 3 needs that. |
| 2. Build the perishable rule in `isBopisEligible`: refuse an item whose category is produce, dairy, meat, frozen or bakery. Put `REQ-003` in a comment next to the rule | REQ-003 | `src/bopis/eligibility.js` | Decide by category only, never by `shelfLifeDays`. Do **not** reuse `isPerishable` from `src/bopis/catalog.js`: it decides by shelf life of 7 days or less, which is the opposite of what the product owner said (frozen lasts 180 days, a pantry item with 2 days is fine). Change nothing else: not the weight rule, not the other rules. |
| 3. Prove the perishable tests were red: take the fix away, run `npm test -- --grep REQ-003`, put it back, run it again, and write down both results | REQ-003 | `docs/red-green.md` (**new**) | At least two tests must fail without the fix. Milestone 8. Nothing may be left in `git stash list`. |
| 4. Write the tests for the stock buffer | REQ-001 | `tests/spec/req-001-stock-buffer.test.js` (**new**) | Four criteria: quantity 1 with stock 3 passes and with stock 2 fails, quantity 4 with stock 6 passes and with stock 5 fails. The edge is the buffer of 2: a test that only uses stock 100 would not notice 2 becoming 3. Built, so no code task. |
| 5. Write the tests for the maximum quantity | REQ-002 | `tests/spec/req-002-quantity.test.js` (**new**) | Two criteria: 6 passes and 7 fails. Built, so no code task. |
| 6. Write the tests for hazardous items | REQ-004 | `tests/spec/req-004-hazmat.test.js` (**new**) | Two criteria: hazmat is refused and a non-hazmat item is eligible. Built, so no code task. |
| 7. Write the tests for age-restricted items | REQ-005 | `tests/spec/req-005-age-restricted.test.js` (**new**) | Three criteria: restricted without an age check is refused, restricted with one is eligible, and an unrestricted item without one is eligible. Built, so no code task. |
| 8. Write the tests for gift cards | REQ-006 | `tests/spec/req-006-gift-cards.test.js` (**new**) | Two criteria: a gift card at $50 is refused and an apparel item at $50 is eligible. Built, so no code task. |
| 9. Write the tests for the store being open | REQ-007 | `tests/spec/req-007-store-open.test.js` (**new**) | Two criteria: a closed store refuses and an open store is eligible, both with stock 100. Built, so no code task. |
| 10. Write the tests for the high-value rule | REQ-009 | `tests/spec/req-009-high-value.test.js` (**new**) | Two criteria: $2,001 is refused and exactly $2,000 is eligible. Built, so no code task. No test anywhere covers this rule today (`tests/existing` never uses a price above $50): a `>` turned into `>=` would go unnoticed. |
| 11. Write the requirement ID in a comment next to each rule that already exists | REQ-001, REQ-002, REQ-004, REQ-005, REQ-006, REQ-007, REQ-009 | `src/bopis/eligibility.js` | **Comments only**: the behaviour must not change, and `npm test` must give the same result before and after. The traceability check (task 12) finds code by the ID in `src/`. The IDs for REQ-003 and REQ-008 are written by tasks 2 and 14. |
| 12. Build the traceability check: it links every requirement to its code and its tests, flags the gaps, and flags drift between two commits | REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-006, REQ-007, REQ-008, REQ-009 | `tools/trace.mjs` (**new**) | Serves every requirement at once. It reads `spec/`, `src/` and `tests/spec/` each time and keeps nothing. Until task 14 is done it must flag REQ-008 and nothing else. The team's tests in `tests/existing` have no ID in their names, so they never count as a requirement's tests. |
| 13. Write the tests for the weight limit, with names that start with `REQ-008:` | REQ-008 | `tests/spec/req-008-heavy.test.js` (**new**) | Two criteria: 21 kg is refused and exactly 20 kg is eligible. Add a third test just above the edge (20.1 kg, refused), so a `>=` or a limit of 21 does not slip through. Milestone 9 asks for three. |
| 14. Build the weight rule in `isBopisEligible`: refuse an item with `weightKg` over 20. Put `REQ-008` in a comment next to the rule | REQ-008 | `src/bopis/eligibility.js` | Over 20 kg, so exactly 20 kg stays eligible. The spec leaves open what happens with no weight, so ask Dana before relying on it: a plain `>` comparison happens to leave such an item eligible, by accident and not by decision. Change nothing else. |

## Why this order

- **Tasks 1 to 3 first (REQ-003).** The perishable rule is the one the product owner changed most, and the tests are written before the
  code, so that they are seen to fail. A test that was never red proves nothing.
- **Tasks 4 to 10 next.** The built requirements only need tests, which pass at once. Doing them after task 2 means that any change
  to a built rule made while building the perishable rule shows up as a red test.
- **Task 11 before task 12.** The traceability check needs the IDs to be in `src/` before it can find them.
- **Tasks 13 and 14 last (REQ-008).** It is the second unbuilt requirement, but it is the homework. It is the same method as tasks 1
  and 2, so it comes after that method has been proved.

## Not planned

- No change to `isPerishable` in `src/bopis/catalog.js`: it is not used, and the perishable rule must not use it. It does not say what
  the spec says, so it is a trap for later, but changing it is not asked for by any requirement.
- No change to `tests/existing/`, the PRD or the Slack export. They are the record of what the team had.
- Nothing for the items flagged in the spec as left out (speed of the check, what the customer sees). They are non-goals.

# Red, then green: REQ-003 (perishable items)

Requirement: **REQ-003: Perishable items**, in `spec/bopis-eligibility.md`. The rule is one line in `src/bopis/eligibility.js`:
`if (PERISHABLE_CATEGORIES.has(item.category)) return false; // REQ-003`.

The fix is already committed, so `git stash` (which only sets aside changes that are not committed) could not take it away. The rule
line was deleted from the working copy instead, and put back with `git checkout -- src/bopis/eligibility.js`. Nothing is in
`git stash list`.

## Commands and what they showed

| Step | Command | Result |
|---|---|---|
| 1. With the fix | `npm test -- --grep REQ-003` | **Pass**: 10 of 10 REQ-003 tests passed (19 of 19 entries, counting the 9 other test files this filter also lists). |
| 2. Fix removed (the rule line deleted from `src/bopis/eligibility.js`) | `npm test -- --grep REQ-003` | **Fail**: 7 of the 10 REQ-003 tests failed: produce, dairy, meat, frozen, bakery, the shelf-life loop and the plenty-of-stock test. |
| 3. Fix put back (`git checkout -- src/bopis/eligibility.js`) | `npm test -- --grep REQ-003`, then `npm test` | **Pass**: 10 of 10, and the whole suite passed 64 of 64. |

The 3 tests that stayed green without the fix are the ones that say an item is **eligible**: pantry with a shelf life of 2 days,
household with a shelf life of 3 days, and the loop over categories that are not perishable. That is right. Without the rule nothing is
refused for being perishable, so a test that expects "eligible" cannot notice it is missing. Only the tests that expect "not eligible"
can, and all 7 of them did.

## What it would mean if a test had never been red

A test that has never been red is not proof that the feature works: it is proof that nobody has seen the test check anything. If all
the REQ-003 tests had stayed green with the rule deleted, they would be asserting something that was already true without the rule,
so they would pass whether or not the requirement was met, and the green result would be false comfort.

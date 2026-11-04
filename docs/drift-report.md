# Drift report: BOPIS eligibility

Compared: `docs/prd.md` (v0.3), `docs/slack-thread.md` (sprints 2 and 3), `src/bopis/eligibility.js`, `src/bopis/catalog.js` and
`tests/existing/eligibility.test.js`. Line numbers are those of `src/bopis/eligibility.js`.

| Item | Source | Status | Evidence |
|---|---|---|---|
| Store stock | PRD section 1 | differs | The PRD says a buffer of 3 units. The code uses a buffer of 2: `const STOCK_BUFFER = 2;` (line 12), enforced by `if (storeStock < quantity + STOCK_BUFFER) return false;` (line 23). The Slack thread decided it: sprint 2, Tuesday, Dana asks for 2 and Raj replies "changing the buffer to 2. will update the PRD later". The PRD was never updated. `tests/existing/eligibility.test.js` also expects a quantity of 1 to be eligible with a stock of 3. |
| Quantity | PRD section 2 | implemented | `const MAX_QUANTITY = 6;` (line 11) and `if (quantity > MAX_QUANTITY) return false;` (line 22). Six units pass and seven fail, as `tests/existing/eligibility.test.js` ("six units are fine, seven are too many") shows. |
| Perishable items | PRD section 3 | missing | `src/bopis/eligibility.js` has no perishable rule and imports nothing. `isPerishable` in `src/bopis/catalog.js` ("Sprint 1 spike for the perishable rule. It was never wired in.") is not called anywhere in `src/`. Slack sprint 3, Monday: Tomás cannot find a test and Raj is unsure it was done. Wednesday: "nobody owns it". |
| Hazardous items | PRD section 4 | implemented | `src/bopis/eligibility.js` line 20: `if (item.hazmat) return false;`. Covered by "a hazmat item is not eligible" in `tests/existing/eligibility.test.js`. |
| Age-restricted items | PRD section 5 | implemented | `src/bopis/eligibility.js` line 21: `if (item.ageRestricted && !ageVerified) return false;`. `ageVerified` defaults to `false`. |
| Gift cards | PRD section 6 | implemented | `src/bopis/eligibility.js` line 19: `if (item.category === 'gift-card') return false;`. |
| Store must be open | PRD section 7 | implemented | `if (!storeOpen) return false;` (line 18) in `src/bopis/eligibility.js`. `storeOpen` defaults to `true`. |
| Heavy items (over 20 kg) | PRD section 8 | missing | `src/bopis/eligibility.js` never reads `weightKg`. The word appears only in the header comment (line 5), which documents the item shape. Slack sprint 3, Wednesday: Tomás says "nobody remembers whether the 20 kg limit made it in". It did not. |
| Price cap: items over $2,000 are not eligible | none (Slack sprint 2, Thursday) | undocumented | `const HIGH_VALUE = 2000;` (line 13) and `if (item.price > HIGH_VALUE) return false;` (line 24) in `src/bopis/eligibility.js`. Mei (fraud team) asked for it ("anything priced over $2,000 should not go to curbside pickup. exactly $2,000 is fine") and Raj shipped it. Mei asked for it to be put in the requirements and Raj replied "will do". It is in no section of `docs/prd.md` and no test in `tests/existing/` covers it. |

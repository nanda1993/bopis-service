# Spec review: draft 0.1 against the product owner's answers

Reviewed: `spec/bopis-eligibility.md` draft 0.1 (commit `432ae24`) against the product owner's answers (`npm run po`), Dana Whitfield.
Result: draft 0.2, approved by Dana Whitfield. Where an answer differed from the draft, the spec changed.

| Item | What the AI wrote | Decision | Why |
|---|---|---|---|
| REQ-003 perishable (the requirement the AI read most loosely) | "A perishable item is never eligible." It did not define perishable, and flagged the question. The unused `isPerishable` helper (shelf life of 7 days or less) was named but not adopted. | Changed: perishable is now the five categories produce, dairy, meat, frozen and bakery, decided by category and not by the date. Seven criteria: one for each category, plus pantry and household as eligible. | Dana: "anything that spoils quickly" was shorthand and too loose. It is not about the date on the packet. Frozen counts although it lasts for months, and pantry does not count even with a short date. The helper decides by date, so it would be wrong for frozen (long date) and for pantry (short date) and must not be reused. |
| REQ-001 stock buffer | A buffer of 2, following Slack over the PRD's 3, with the conflict flagged. | Accepted: the buffer stays 2, and the source line now says the product owner confirmed it. | Dana: the Slack decision stands, the buffer is 2 and not 3. The PRD was the document that was wrong. |
| REQ-009 $2,000 rule | Added from the Slack thread (Mei and Raj), marked as not yet confirmed by the product owner. | Accepted: kept as a requirement, now marked as confirmed. | Dana: keep it, it is the fraud team's rule and she wants it in the requirements. Over $2,000 is not eligible and exactly $2,000 is fine, as written. |
| REQ-005 age-restricted | "Eligible only when the customer's age has been verified at checkout." | Tightened: "verified" now means an age check recorded at checkout for the order, in the statement and in all three criteria. The spec was already right, and the answer is more precise. | Dana defined "verified" as an order with an age check recorded at checkout. A requirement should not leave a word like that to the reader. |
| "Eligibility checks should be fast." (PRD section 9) | Flagged as too vague, asking how fast, measured where. | Dropped: no requirement, and listed under Non-goals. | Dana: not a requirement of this feature, performance is tracked elsewhere. |
| "Most large items should be excluded." (PRD section 9) | Flagged, asking what "large" and "most" mean. | Merged: it is the heavy-item requirement (REQ-008), so there is nothing new to write. | Dana: wrong word, large means heavy, and all items over 20 kg are excluded. |
| "Customers should have a good experience when an item is not eligible." (PRD section 9) | Flagged, asking what a good experience is and whether it needs a reason. | Dropped: no requirement, and listed under Non-goals. | Dana: that is the design team's work and out of scope for this spec. |
| "Items that are risky to hand over should be handled carefully." (PRD section 9) | Flagged, asking which items are risky and what "carefully" means. | Merged: covered by REQ-004 (hazmat) and REQ-005 (age-restricted), so there is nothing new to write. | Dana meant hazardous and age-restricted items, which have their own requirements. She did not include high-value items. |
| REQ-002, REQ-004, REQ-006, REQ-007, REQ-008 | As in the PRD: 6 units, hazmat, gift cards, store open, 20 kg. | Accepted: unchanged, except that REQ-007 now also says that nothing is eligible at a closed store, and the REQ-008 source line says the product owner confirmed it. | Dana: "as the PRD says". Six is allowed and seven is not, exactly 20 kg is eligible, and the 20 kg rule is still wanted. |

**Not settled by the product owner.** Dana did not say what happens when an item has no weight or no price. The spec lists it as an open
question, and does not guess.

**Who approves changes.** Dana: "Nobody else changes a requirement without my say." The spec names her as Owner and as the approver, and
its changelog has one entry for each version.

# bopis-service: notes for Claude Code

A small Node project (plain JavaScript, ES modules, Node 20+, no dependencies): the eligibility service for a retailer's "buy online,
pick up in store" (BOPIS) feature. Read this first. It is the project's context file.

## What the code does
- `isBopisEligible(item, ctx)` in `src/bopis/eligibility.js` says whether one item can be offered for pickup at the customer's store.
  It is a **pure function**: no clock, no network, no files. It returns `true` or `false`.
- `item`: `{ sku, name, category, weightKg, price, shelfLifeDays, hazmat, ageRestricted, supplier_recall }` (only `sku` and `category`
  are always present). `ctx`: `{ quantity = 1, storeStock = Infinity, storeOpen = true, ageVerified = false }`.
- `src/bopis/catalog.js` has the category list and a few helpers. Not every helper is used by the eligibility rules.

## The documents
- `docs/prd.md` is the product requirements. `docs/slack-thread.md` is an export of what the team decided in Slack. They are the
  sources: read them, do not edit them.
- The spec is `spec/bopis-eligibility.md` (written during the lab). Requirements are `## REQ-001`-style headings with Given / When / Then
  criteria. If the spec and the code disagree, say so and ask. Do not quietly pick one.
- The user's milestone cards (in `LAB-GUIDE.md`) hold the interface contract for each milestone, including file names and the format of
  each document. **They are binding.** Follow them exactly, and say so if the user's request conflicts with one.

## The tools (in `scripts/`, run with `npm run ...`)
- `npm test` runs every test. `tests/baseline` is the lab's own, `tests/existing` is the team's, `tests/spec` is the user's.
  `npm test -- --grep REQ-003` runs the tests whose name contains `REQ-003`.
- `npm run step -- N` runs the check for milestone N. You may run it to check work. Do **not** run `npm run hint`, `npm run po`,
  `npm run checkpoint` or `npm run setup`: they are the user's tools.

## Files and contracts
- Do **not** edit `scripts/`, `tests/baseline/`, `tests/existing/`, `docs/prd.md`, `docs/slack-thread.md` or `package.json` unless the
  user says to. They are the lab's fixtures and the record of what the team had.
- New tests go in `tests/spec/`, in files ending in `.test.js`. They use `node:test`.
- Notes and reports go in `docs/`. Tools the user builds go in `tools/`.
- Keep the name, the file and the export of `isBopisEligible`: the tests and the lab's checks import it from `src/bopis/eligibility.js`.

## Working here
- Run `npm test` before you say you are done.
- Commit only when the user asks you to. The user's lab guide tells them to commit after each document or change that is ready, so
  expect to be asked often: make one commit for one thing, with a short message that says what it did.
- There is no server and no database. Never start a process that does not exit.
- Everything in this project is made up. There is no real customer data and no API key.

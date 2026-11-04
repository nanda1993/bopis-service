# DD8 Lab Guide: put the spec back in charge of the code

A retailer's "buy online, pick up in store" (BOPIS) feature has drifted. The PRD says one thing, the team agreed another in Slack, and
the shipped code does a third. A rule about perishable items was never built, and a rule about expensive items was built but never
written down. In this lab you turn the PRD into a spec that humans and AI can both build from, close the gap with a test that cites
its requirement, and build a check that catches the next drift before a customer does.

**There are no prompts to paste in this lab.** Each milestone is a ticket: a goal, what you are given, a contract, and success
criteria. You decide how to get there, with Claude Code (writing your own brief), by hand, or both.

**You work by yourself, at your own pace.** The facilitator does not stop the room after each milestone. They check in twice:
after milestone 4 and after milestone 8. Each time they walk through the steps, the tests and the solutions for the milestones
before it. Until then, you have the cards, the checks, the hints and the chat.

---

## How the lab runs

| Block | Milestones | About how long | Then |
|---|---|---|---|
| **A** | 1, 2, 3, 4 | 45 minutes | The facilitator's first summary (steps, tests, solutions for 1 to 4) |
| **B** | 5, 6, 7, 8 | 39 minutes | The facilitator's second summary (steps, tests, solutions for 5 to 8) |
| Homework | 9 | about an hour | Your own time |

- **Each card has a pace** (for example "aim for 10 minutes") and the times when its hints open. They are a guide. A milestone that
  takes you twice as long is fine, and a slow milestone costs you nothing, because syncing is free (see below).
- **Check yourself.** `npm run step -- N` runs the check for milestone N and tells you which success criteria are not met yet. You
  never need to ask anyone whether you are done: the check says so.
- **Hints.** There are three hints per milestone. The clock for a milestone starts the first time you run `npm run start -- N`,
  `npm run step -- N` or `npm run hint -- N`. Each hint opens a few minutes later. If you run `npm run hint -- N` too early, it
  tells you how long to wait. That is a nudge, not a lock: `npm run hint -- N --now` takes it anyway, and notes that it was early.
  **Try first.** Most of the learning is in the first few minutes of being stuck.
- **Sync.** `npm run checkpoint -- N` replaces your work with the reference solution for milestone N, so that the next milestone
  starts from known-good files. It does this with real git commits, one for each step of the reference. **Your own work is kept**:
  your commits, and anything you had not committed, go onto a branch called `my-work-<time>`. You can sync at any time. If you do,
  try to explain the milestone in one sentence in your log.
- **The reveal.** `npm run hint -- N --reveal` shows the reference brief (a good prompt), the approach and the common mistakes. The
  facilitator opens it at the summaries. Read it earlier if you must, and say so in your log.
- **The chat.** Teaching assistants are watching it. "Stuck on 3, the check says the perishable requirement still decides by date"
  gets a better answer than "it's broken".
- **The pulse.** At the two summaries you may be asked to run `npm run progress` and paste its last line (it starts with PULSE).
- **Finished early?** Every card has stretch goals. They are worth doing. Or help a neighbour: explaining a fix is the quickest
  way to find out whether you understand it.

---

## Your commands

`npm run help` lists everything. The ones you will use all the time:

| Command | What it does |
|---|---|
| `npm run setup` | Makes the starting commit, "Shipped code as delivered". Do it **once, before you change anything**. |
| `npm test` | Runs every test: the lab's own (`tests/baseline`), the team's (`tests/existing`) and yours (`tests/spec`). |
| `npm test -- --grep REQ-003` | Runs only the tests whose name contains `REQ-003`. `--grep REQ-` runs every requirement-linked test. |
| `npm run po` | Prints the product owner's answers to the team's questions. A milestone tells you when to ask. |
| `npm run trace` | **Your** traceability check (milestone 7). It does not exist until you build it. |
| `npm run step -- N` | Checks milestone N (1 to 9). |
| `npm run progress` | Checks every milestone and prints one line to paste in the chat. |
| `npm run hint -- N` | The next hint for milestone N (`--now` early, `--again` to re-read, `--reveal` for the reference). |
| `npm run checkpoint -- N` | Replaces your work with the reference solution for milestone N. Your own work is kept on a branch. |
| `git status --short`, `git add -A`, `git commit -m "..."`, `git log --oneline`, `git diff`, `git stash` | The git you need. Commit after each document or change that is ready. |

---

## What is yours to change, and what is not

Yours: `spec/`, `docs/` (new files), `src/bopis/eligibility.js` (and new files in `src/bopis/`), `tests/spec/`, `tools/`, `LAB-LOG.md`.

Not yours: `scripts/` (the lab's runner), `tests/baseline/`, `tests/existing/` (the team's tests: they are the record of **how the
code behaves today**), `docs/prd.md` and `docs/slack-thread.md` (the sources you are reading: a PRD you edit to fit the code proves
nothing), and `package.json`.

## Ground rules

1. **Read the card before you open Claude.** Know what "done" looks like first.
2. **Write your own brief.** The success criteria on the card are your acceptance criteria. A good brief says the context, the
   task, the constraints, how you will know it worked, and how to check (see the template at the end).
3. **Read every output before you accept it.** A spec the AI wrote is a draft, not a decision.
4. **A spec records what is wanted**, including what is not built yet. A document that only describes the code is not a spec.
5. **The product owner decides what a requirement means. The AI suggests.** An interpretation nobody reviewed is a guess wearing the
   spec's authority.
6. **Commit after each document or change that is ready.** The spec's history is part of the lab: a change you can see is a change
   that cannot drift silently.
7. **Hints are free once they open.** Taking one early is allowed. Taking one without trying first is how you miss the learning.
8. **Every file in this kit is made up.** The retailer, the people, the rules and the numbers are not real. There is no real
   customer data anywhere.

## About the checks

There is no API key in this lab: **Claude Code is the AI**. The checks read your documents (the drift report, the spec, the review,
the task list) and judge what they **say** against a hidden list of facts about the PRD, the Slack thread and the code. For code they
**run** it: your function is compared with a hidden answer key on thousands of sample items, and your tests are run against slightly
wrong versions of the rules, to see whether they notice. Whether your prose is wise is for the summaries to discuss.

---

## Milestone 1 · Find the drift

**Ticket SPEC-801** · aim for **10 minutes** · hints open at **+5, +7, +9**

**Why this matters.** A PRD that is not the real source of truth keeps drifting, sprint after sprint. Before you can fix drift you
have to find all of it, and a missing requirement often has no trace at all.

**Your goal.** Compare the PRD, the Slack thread and the shipped code, and write down every gap, with the evidence.

**You are given.** `docs/prd.md`, `docs/slack-thread.md`, `src/bopis/` and `tests/existing/`, and Claude Code.

**Interface contract.** Create `docs/drift-report.md` with a table like this:

```
| Item | Source | Status | Evidence |
|---|---|---|---|
| Store stock | PRD section 1 | implemented / missing / differs / undocumented | src/bopis/eligibility.js, the line or the words |
```

- One row for each of the **eight requirements** in sections 1 to 8 of the PRD, and one row for each **rule the code follows that the
  PRD does not mention**.
- `Status` says what is true: **implemented**, **missing**, **differs** (say how) or **undocumented** (in the code, in no requirement).
- `Evidence` names a **file that exists** (and the line, or the words, that prove it). A word search that finds something proves
  nothing: a helper that exists is not a rule that is enforced.
- Use the Slack thread as evidence where it decided something.

**Success criteria.**
- **Must:** ☐ the table exists with an Item, a Status and an Evidence column ☐ every requirement of the PRD has a row, and so does the rule that only the code knows ☐ the statuses are what the code really shows ☐ every row names a file that exists ☐ the report is committed, and the PRD, the Slack export and the tests are untouched ☐ `npm run step -- 1` passes
- **Stretch:** ☐ ask Claude for the report, then open the files and check three of its claims. Which one was wrong, and how did you find out? ☐ four sentences in section 9 of the PRD are not drift, but a spec cannot be built on them. Which?

**Where to start.**
- For each section of the PRD: which line of `eligibility.js` is it? If you can't find one, is it really missing, or is it somewhere else?
- Who calls each helper in `catalog.js`? A thing that exists and is never used: is that "implemented"?
- Which numbers in the code appear in the PRD, and which in the Slack thread?
- Is there anything the code refuses that no document asks for?

**Verify yourself.** `npm run step -- 1`

---

## Milestone 2 · Convert the PRD to a spec

**Ticket SPEC-802** · aim for **14 minutes** · hints open at **+6, +9, +12**

**Why this matters.** AI-assisted code generation only helps if the spec is precise enough to build against. Vague requirements just
produce vague code faster. A spec has stable IDs, criteria you could write a test from, and an honest list of what it could not pin down.

**Your goal.** Turn the PRD into a structured spec, `spec/bopis-eligibility.md`, using Claude, and commit the first draft as it comes.

**You are given.** The PRD, your drift report, and Claude. **Do not ask the product owner yet** (`npm run po`): this milestone is
about what the PRD alone gives you, and what the AI does with it.

**Interface contract.** The file is `spec/bopis-eligibility.md`.

- Each requirement is a heading `## REQ-001: A short title`: three digits, starting at 001, in the PRD's order, never reused.
- Under it, **one line** that says what must hold (at least four words), then one or more **Given / When / Then** criteria. A
  criterion is precise enough to write a test from, so it uses numbers.
- Include the requirements the code does **not** meet yet. A spec records what is wanted.
- A section called **Non-goals** (the PRD says what is out of scope).
- A section whose heading says **Flagged** or **too vague** or **open question**: the sentences you could not turn into a testable
  requirement, each with the question it raises. Do **not** turn them into requirements.
- A line `Owner: <a name>`, and a section called **Changelog** with a first entry.
- **Commit the AI's first draft before you change it.**

**Success criteria.**
- **Must:** ☐ every requirement has an ID of the form `REQ-001`, no two the same ☐ each has a one-line statement and at least one Given / When / Then ☐ every rule in sections 1 to 8 of the PRD has a requirement of its own ☐ the vague sentences are flagged and are not requirements ☐ Non-goals, an Owner and a Changelog are there ☐ the spec is committed ☐ `npm run step -- 2` passes
- **Stretch:** ☐ find a criterion that Claude wrote without a number in it. Rewrite it so it can become a test ☐ which requirement did Claude interpret the most loosely? Note it: you will meet it again in milestone 3

**Where to start.**
- What does one requirement look like, before you ask for eight?
- Which sentences of the PRD could you write a test for tomorrow? Which could not?
- How will you stop the AI from guessing what a vague sentence means?
- What would a reader need to know about who can change this spec?

**Verify yourself.** `npm run step -- 2`

---

## Milestone 3 · Review against real intent

**Ticket SPEC-803** · aim for **10 minutes** · hints open at **+5, +7, +9**

**Why this matters.** The spec review, not the code review, is where requirement intent gets locked in. An AI-suggested
interpretation that nobody reviews is not a clarification: it is a guess wearing the spec's authority.

**Your goal.** Review your spec against what the product owner actually meant, correct it, write the review down, and approve the spec.

**You are given.** `npm run po` (the product owner's answers to the team's questions), the Slack thread, your spec, and Claude.
`CLAUDE.md` tells Claude not to run `npm run po`: **you** run it, and you give Claude the answers.

**Interface contract.**
- Wherever the product owner's answer differs from your spec, **the spec changes**. Every rule the code follows must have a requirement.
- Add a line `Approved by: <the product owner's name>`. The `Owner:` line names the product owner too.
- The changelog gets a **second entry** saying what the review changed.
- **Commit the spec twice**: the first draft (milestone 2), then your review of it. `git log` then shows what was there before.
- `docs/spec-review.md`: a table with the columns **Item**, **What the AI wrote**, **Decision** and **Why**.
  At least four rows. Each Decision begins with what you did (accepted, changed, tightened, dropped, merged, asked...). It covers the requirement the
  AI is most likely to have read too loosely, and gives each of the four vague sentences an answer.

**Success criteria.**
- **Must:** ☐ the perishable requirement says what the product owner means, and nothing looser ☐ the stock requirement follows the decision the team took in Slack and the product owner confirmed ☐ the rule that only the code knew about is now a requirement ☐ the review table is complete ☐ the spec is approved, and has two changelog entries and two commits ☐ `npm run step -- 3` passes
- **Stretch:** ☐ find a place where the product owner's answer is **more** precise than your spec, even though the spec was already right. Tighten it ☐ ask Claude to find any requirement the answers contradict. Verify what it says

**Where to start.**
- Which of Dana's answers does your spec disagree with? Read them one at a time.
- Where does the code do something on purpose that the PRD says otherwise? Why?
- For each vague sentence: is it a requirement, a non-goal, or nothing at all?
- Who has to say "approved", and what do you write in the changelog so nobody can change a requirement silently?

**Verify yourself.** `npm run step -- 3`

---

## Milestone 4 · Generate the task breakdown

**Ticket SPEC-804** · aim for **10 minutes** · hints open at **+5, +7, +9**

**Why this matters.** A plan that is traceable to the spec shows what work is left, and what work has no reason to exist. Code with
no requirement attached is code nobody can explain in six months.

**Your goal.** Produce a task list and implementation plan from the finished spec, mapped by requirement ID.

**You are given.** The reviewed spec, your drift report, the code, and Claude.

**Interface contract.** Create `docs/tasks.md` with a table with the columns **Task**, **Requirement**, **Files** and **Notes**.

- Every task cites a requirement ID. A task with no ID is work with no reason.
- Every requirement in the spec has at least one task.
- `Files` names real paths. A file that does not exist yet is marked **new** in the row.
- The plan knows which requirements are **already built** (their task is a test; a task that only writes the ID in a comment next to the rule is fine too, because milestone 7 needs it) and which are **not** (they need a task for
  `src/bopis/eligibility.js` and a task for the test). Do not plan code for what already exists.
- Commit it.

**Success criteria.**
- **Must:** ☐ a table with a Requirement column and a Files column ☐ every requirement has a task, and every task cites a requirement that exists ☐ each task names a file, and new files are marked ☐ the unbuilt requirements have a code task and a test task, and the built ones have tests only ☐ it is committed ☐ `npm run step -- 4` passes
- **Stretch:** ☐ add a column for the order the tasks should happen in, and say why ☐ which task would you hand to Claude, and which would you do yourself?

**Where to start.**
- Which requirements did your drift report say are built? What is left for those?
- Is there code in the repo you are tempted to reuse? Does it do what the **spec** says?
- Which tasks serve every requirement at once?

**Verify yourself.** `npm run step -- 4`

---

## Milestone 5 · Implement the missing requirement

**Ticket SPEC-805** · aim for **10 minutes** · hints open at **+5, +7, +9**

**Why this matters.** Code and tests are generated from the spec and traced back to it, not the other way round. A test whose name
cites its requirement is a test that can be found, checked, and held to account.

**Your goal.** Build the perishable rule exactly as the reviewed spec says, with tests whose names start with its requirement ID.

**You are given.** The spec, your plan, the code, `node:test`, and Claude.

**Interface contract.**
- Change `src/bopis/eligibility.js` (and new files in `src/bopis/` if you wish). `isBopisEligible(item, ctx)` keeps its name and its
  shape. It still returns `true` or `false`.
- It must do **exactly** what the spec says about perishable items, and **nothing else may change**. The weight rule is the homework.
- Put the requirement ID (for example `REQ-003`) in a comment next to the rule.
- Tests go in `tests/spec/`, in files ending in `.test.js`. **At least three** tests have names that **start** with the requirement ID,
  such as `REQ-003: a frozen item is not eligible`. Use `node:test`, like the existing tests.
- The check puts **five slightly wrong versions** of the perishable rule in place of your code and runs your tests for that
  requirement. They must fail on **every one**.
- Commit it. Everything in `src/` and `tests/` must be committed when you run the check.

**Success criteria.**
- **Must:** ☐ the code does what the spec says, and nothing else has changed ☐ the requirement ID is next to the code ☐ at least three tests start with the ID, and pass ☐ your tests notice all five wrong versions ☐ it is committed ☐ `npm run step -- 5` passes
- **Stretch:** ☐ write the tests first and run them: do they fail? ☐ is there a case where the date on the packet and the category disagree? Does your code get both right?

**Where to start.**
- What exactly does the spec say perishable means? Is there a helper already? Does it say the same?
- What are the two sides of the rule, and what is the case that tempts a loose implementation?
- Which tests would stay green if the rule were missing?

**Verify yourself.** `npm test -- --grep REQ-003`, then `npm run step -- 5`

---

## Milestone 6 · Tests from the acceptance criteria

**Ticket SPEC-806** · aim for **11 minutes** · hints open at **+5, +8, +10**

**Why this matters.** Given / When / Then is not bureaucracy: it is the difference between a requirement you can generate a real test
from and one you can only argue about. Every acceptance criterion should have a test, not only code.

**Your goal.** Give every acceptance criterion of every built requirement a test whose name cites the requirement, and run the suite.

**You are given.** The spec, the code, `tests/spec/`, and Claude.

**Interface contract.**
- For each requirement that is built (including the rule that came from Slack and not from the PRD), there are **at least as many tests as the requirement has acceptance criteria**, and every test's
  name **starts** with that requirement's ID. Word each test close to its criterion.
- The tests pass, and `npm test -- --grep REQ-` passes. Every ID that appears in a test name is a requirement in the spec.
- Do not write tests for the requirement that is not built yet. Leave that for the homework.
- Do not change `src/`: writing tests must not change behaviour.
- The check puts **sixteen slightly wrong versions** of the rules in place of your code and runs your `REQ-` tests. At most one may
  go unnoticed.
- Commit it.

**Success criteria.**
- **Must:** ☐ every criterion of every built requirement has a test with the requirement's ID in its name ☐ `npm test` and `npm test -- --grep REQ-` are green ☐ no test cites a requirement that is not in the spec ☐ your tests notice the slightly wrong versions ☐ it is committed ☐ `npm run step -- 6` passes
- **Stretch:** ☐ break a rule in `src/` yourself (a `>` into a `>=`) and see which test goes red. Put it back ☐ which criterion was the hardest to turn into a test, and why?

**Where to start.**
- How many criteria does each requirement have? That is how many tests it needs.
- For each rule: what is its edge, and what is just either side of it?
- If you changed a number in the code by one, which test would notice?

**Verify yourself.** `npm test -- --grep REQ-`, then `npm run step -- 6`

---

## Milestone 7 · Build the traceability check

**Ticket SPEC-807** · aim for **12 minutes** · hints open at **+6, +9, +11**

**Why this matters.** A traceability table checked once at kickoff and never again is a table that is already lying to you by sprint
two. It has to be a check that runs on every change, and that can flag drift.

**Your goal.** Build a script that links every requirement to its code and its tests, flags the gaps, and flags drift between two commits.

**You are given.** The spec, the code, the tests, and Claude. `npm run trace` is already wired to `tools/trace.mjs`.

**Interface contract.** Create `tools/trace.mjs` in plain Node (no packages).

- `node tools/trace.mjs` prints a table with one row for each requirement: **Requirement, Code, Tests, Status**.
- A **requirement** is a heading `## REQ-001` in a file under `spec/`. An ID in the middle of a sentence is not a requirement.
- **Code** is a file under `src/` that contains the ID (in a comment, for example). **Tests** are `test(...)` or `it(...)` calls under
  `tests/` whose name **starts** with the ID. A comment that mentions an ID is not a test.
- It reads the files **every time**. It keeps nothing between runs and writes no snapshot.
- **Exit code 1** if a requirement has no code or no test, or if an ID appears in code or tests but is not a requirement (an
  **orphan**). Exit code 0 only when everything is traced.
- `--json` prints only JSON: `{ "ok": false, "requirements": [ { "id": "REQ-001", "code": ["src/..."], "tests": ["REQ-001: ..."] } ], "orphans": [ { "id": "REQ-009", "files": ["src/..."] } ] }`
- `--root <dir>` checks another project folder instead of the current one.
- `--base <git-ref>` also flags **drift**: it runs `git diff --name-only <ref>` and prints a line containing **DRIFT** (and exits 1)
  when a file under `src/` changed and nothing under `spec/` did.
- Also write the **requirement IDs in comments next to the rules** in `src/bopis/eligibility.js`, so the tool can find them. Comments
  only: the behaviour must not change.
- Commit it.

**Success criteria.**
- **Must:** ☐ the tool exists and is committed ☐ it passes on a project where everything is linked, and flags a requirement with no code, one with no test, and an orphan ☐ a comment is not a test, and an ID in a sentence is not a requirement ☐ it never shows a stale answer ☐ the drift check works ☐ on this project it flags only the requirement that is not built ☐ the behaviour of the code is unchanged ☐ `npm run step -- 7` passes
- **Stretch:** ☐ make `--base` ignore a change to comments only ☐ what would it take to run this in a pull request, so that a merge with drift is blocked?

**Where to start.**
- What three things does the tool have to find? Where does each one live?
- What would fool a simple search for the text `REQ-001`?
- What should the tool do about an ID it has never heard of?
- How would a pull request check use the exit code?

**Verify yourself.** `npm run trace`, then `npm run step -- 7`

---

## Milestone 8 · Prove the test was red first

**Ticket SPEC-808** · aim for **5 minutes** · hints open at **+2, +3, +4**

**Why this matters.** A test that was never red is not proof that the feature works. It is proof that the test was never checking
anything. Watching it fail without the fix is the cheapest evidence there is.

**Your goal.** Take the perishable fix away, confirm the requirement's tests fail, put it back, confirm they pass, and write it down.

**You are given.** Git, your tests, and the commands `git stash` and `git checkout`. (The slides use `git stash`, which only sets aside
changes that are **not committed yet**. Yours is committed.)

**Interface contract.**
- Without the fix, **at least two** of your tests for the perishable requirement **fail**. With the fix they all pass. (The check does
  this for you in a scratch copy, and your project is never touched.)
- `docs/red-green.md`: the commands you ran (`npm test -- --grep REQ-003`), what you saw in both runs (fail, then pass), the name of the
  requirement, and a sentence on what it would mean if a test had **never** been red. At least thirty words.
- When you are done, **the fix is back**, nothing is left in `git stash list`, and everything is committed.

**Success criteria.**
- **Must:** ☐ with the fix, the tests pass ☐ without it, at least two fail ☐ the note records the commands and both results ☐ it is committed and nothing is left waiting ☐ `npm run step -- 8` passes
- **Stretch:** ☐ which of your tests did **not** fail without the fix? Is that right? ☐ look at `tests/existing`: is there a test there that could never be red?

**Where to start.**
- How do you take a fix away without losing it? What is the difference between `git stash` and checking out the old file?
- Which tests should still pass without the fix, and why?
- What would you conclude if every test stayed green?

**Verify yourself.** `npm run step -- 8`

---

## Homework · Milestone 9 · A second requirement

**Ticket SPEC-809** · about an hour, in your own time · hints open at **+10, +20, +30**

**Why this matters.** One requirement is an anecdote. Two, done the same way, are a method. This is also the check that your tools
survive a real change.

**Your goal.** Take the second requirement that the code does not meet, the weight limit, and carry it through: it is already in your
spec, so build it, test it, and trace it.

**You are given.** Everything from the lab.

**Interface contract.**
- The code refuses items heavier than 20 kg and nothing else changes (an item of exactly 20 kg is eligible; an item with no weight is
  eligible). Put the requirement ID in a comment next to the rule.
- At least three tests whose names start with the requirement ID, in `tests/spec/`. Your tests must notice three slightly wrong
  versions of the rule.
- `npm run trace` shows **every** requirement traced, with no gaps and no orphans, and exits with 0.
- Commit it as its own commit.

**Success criteria.**
- **Must:** ☐ the code does what the spec says about weight, and nothing else changed ☐ the ID is in the code, and three tests carry it ☐ your tests notice the wrong versions ☐ the trace shows no gaps ☐ `npm run step -- 9` passes ☐ `npm run progress` still shows milestones 1 to 8 as done
- **Stretch:** ☐ the code is now right, but is the **spec** still right? Reread REQ-008 and the product owner's words about "large". Is anything still vague? ☐ run `npm run trace -- --base <the starting commit>`: what does it say, and what does that tell you?

**Where to start.**
- What did you learn in milestones 5 to 8 that applies directly here?
- What is the edge of the rule, and which two numbers sit either side of it?
- Which of the changes you are about to make is a rule, and which is a comment?

**Verify yourself.** `npm run step -- 9`

---

## Appendix · How to brief an AI coding assistant

This is a template, not a prompt for any milestone. A good brief makes the result checkable.

| Part | Say |
|---|---|
| **Context** | What exists, and what it is for. "This is a Node project; the spec is `spec/bopis-eligibility.md`; the rules are in `src/bopis/eligibility.js`." |
| **Task** | One thing to do, in one sentence. |
| **Constraints** | What it must not touch or change. "Do not change any other rule. Do not edit `tests/existing`. Do not guess what a vague sentence means: flag it." |
| **Acceptance** | The observable results that mean "done": file names, requirement IDs, what a run prints. |
| **Verify** | The commands that prove it. "Run `npm test -- --grep REQ-003`." |

Three habits make a big difference with a spec: ask the AI to **flag what it is unsure of** instead of choosing; ask for **one
document or change at a time**; and **read the output** before you accept it, asking of every line, "which requirement is this, and
who agreed to it?"

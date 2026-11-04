// The milestones, in one place: the lab runner, `npm run hint`, `npm run progress` and `npm run help` all read this.
// `hintMinutes` are the times (minutes after you start the milestone) when each hint opens. They are a nudge, not a lock.
// `targetMinutes` is the pace to aim for. Milestones 1 to 4 are one block of work, and 5 to 8 are another.
export const MILESTONES = [
  { n: 1, title: 'Find the drift', check: 'every gap between the PRD, the Slack thread and the shipped code written down, with evidence', hintMinutes: [5, 7, 9], targetMinutes: 10, block: 'A' },
  { n: 2, title: 'Convert the PRD to a spec', check: 'a structured spec: ID\'d requirements, given/when/then criteria, non-goals, and the vague sentences flagged', hintMinutes: [6, 9, 12], targetMinutes: 14, block: 'A' },
  { n: 3, title: 'Review against real intent', check: 'the spec corrected against the product owner\'s answers, the AI\'s guesses reviewed, and the spec versioned', hintMinutes: [5, 7, 9], targetMinutes: 10, block: 'A' },
  { n: 4, title: 'Generate the task breakdown', check: 'a task list that maps every requirement to the files and tests it touches', hintMinutes: [5, 7, 9], targetMinutes: 10, block: 'A' },
  { n: 5, title: 'Implement the missing requirement', check: 'the perishable rule built exactly as the spec says, with tests whose names cite the requirement', hintMinutes: [5, 7, 9], targetMinutes: 10, block: 'B' },
  { n: 6, title: 'Tests from the acceptance criteria', check: 'every acceptance criterion has a test that cites its requirement, and the whole REQ suite is green', hintMinutes: [5, 8, 10], targetMinutes: 11, block: 'B' },
  { n: 7, title: 'Build the traceability check', check: 'a script that links every requirement to its code and tests, and flags drift', hintMinutes: [6, 9, 11], targetMinutes: 12, block: 'B' },
  { n: 8, title: 'Prove the test was red first', check: 'the requirement tests fail without the fix and pass with it', hintMinutes: [2, 3, 4], targetMinutes: 5, block: 'B' },
  { n: 9, title: 'Homework: a second requirement', check: 'the heavy-item rule specified, built, tested and traced the same way', hintMinutes: [10, 20, 30], targetMinutes: 60, block: 'homework' },
];

export const titleOf = n => MILESTONES.find(m => m.n === Number(n))?.title ?? `Milestone ${n}`;

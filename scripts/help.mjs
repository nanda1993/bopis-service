// `npm run help`: every command in this kit, in one screen. The participant handbook explains each of them in depth.
const sections = [
  ['Work with the code', [
    ['npm test', 'Runs every test: the lab\'s own (tests/baseline), the team\'s (tests/existing) and yours (tests/spec).'],
    ['npm test -- --grep REQ-', 'Runs only the tests whose name contains REQ-. Use --grep REQ-003 for one requirement.'],
    ['npm run trace', 'YOUR traceability check (milestone 7). It links every requirement in spec/ to its code and tests. It does not exist until you build it.'],
    ['npm run po', 'Prints the product owner\'s answers to the team\'s questions. Read it when a milestone tells you to ask.'],
  ]],
  ['The lab', [
    ['npm run setup', 'Makes the starting commit, "Shipped code as delivered". Do it once, before you change anything.'],
    ['npm run start -- N', 'Starts the clock for milestone N and shows when its hints open. (The first step or hint command starts it for you.)'],
    ['npm run step -- N', 'Checks milestone N (1 to 9). It tells you which success criteria are not met yet.'],
    ['npm run progress', 'Checks every milestone and prints one line to paste in the chat. Takes a few seconds to a minute.'],
    ['npm run hint -- N', 'The next hint for milestone N. Three hints, then --reveal for the reference solution. --now takes one early.'],
    ['npm run checkpoint -- N', 'Replaces your work with the reference solution for milestone N, as real commits. Your own work is kept on a branch called my-work-<time>.'],
    ['npm run doctor', 'Checks Node, git and the kit layout.'],
    ['npm run help', 'This screen.'],
  ]],
  ['Git, which the lab uses all the time', [
    ['git status --short', 'What you have changed and not committed yet.'],
    ['git add -A && git commit -m "..."', 'Save one small step. Commit after each document or change that is ready.'],
    ['git log --oneline', 'The steps so far, newest first. The bottom one is the starting commit.'],
    ['git diff', 'What changed since the last commit. Read it before you commit.'],
    ['git stash / git stash pop', 'Puts your uncommitted changes aside, and brings them back. Milestone 8 uses this.'],
  ]],
];

console.log('DD8 lab commands\n');
for (const [title, rows] of sections) {
  console.log(title.toUpperCase());
  for (const [cmd, what] of rows) console.log(`  ${cmd}\n      ${what}`);
  console.log('');
}
console.log('Your guide is LAB-GUIDE.md. Your evidence log is LAB-LOG.md. If a command is a mystery, the handbook has a page on it.');

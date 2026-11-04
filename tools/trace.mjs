// Traceability check: links every requirement in spec/ to the code in src/ and the tests in tests/ that carry its ID, and flags gaps.
//
//   node tools/trace.mjs                  a table: Requirement, Code, Tests, Status
//   node tools/trace.mjs --json           the same, as JSON only
//   node tools/trace.mjs --root <dir>     check another project folder instead of the current one
//   node tools/trace.mjs --base <ref>     also flag DRIFT: src/ changed since <ref> and nothing under spec/ did
//
// Exit code 0 only when every requirement has code and a test and there is no orphan (and no drift, with --base). Otherwise 1.
// Bad arguments or a failing git give exit code 2. Every run reads the files afresh: nothing is kept between runs.
//
//   requirement  a heading "## REQ-001" in a file under spec/ (an ID in the middle of a sentence is not one)
//   code         a file under src/ that contains the ID, in a comment or anywhere else
//   test         a test(...) or it(...) call under tests/ whose name starts with the ID (a comment that mentions an ID is not a test,
//                and neither is a skipped or todo test, which proves nothing)
//   orphan       an ID found in src/, or in the name of a test, that is not a requirement

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const ID = /\bREQ-\d+\b/g;
const SKIP_DIRS = new Set(['node_modules', '.git']);
const TEST_FILE = /\.(?:[cm]?[jt]s|[jt]sx)$/;

const USAGE = 'usage: node tools/trace.mjs [--json] [--root <dir>] [--base <git-ref>]';

function die(message) {
  console.error(`trace: ${message}\n${USAGE}`);
  process.exit(2);
}

function parseArgs(argv) {
  const opts = { json: false, root: process.cwd(), base: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const [flag, inline] = arg.startsWith('--') && arg.includes('=') ? [arg.slice(0, arg.indexOf('=')), arg.slice(arg.indexOf('=') + 1)] : [arg, undefined];
    if (flag === '--json') opts.json = true;
    else if (flag === '--root' || flag === '--base') {
      const value = inline ?? argv[++i];
      if (!value || value.startsWith('-')) die(`${flag} needs a value`);
      if (flag === '--root') opts.root = path.resolve(value);
      else opts.base = value;
    } else if (flag === '--help' || flag === '-h') {
      console.log(USAGE);
      process.exit(0);
    } else die(`unknown argument "${arg}"`);
  }
  return opts;
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .flatMap(entry => {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) return SKIP_DIRS.has(entry.name) ? [] : walk(p);
      return entry.isFile() ? [p] : [];
    });
}

const relative = (root, file) => path.relative(root, file).split(path.sep).join('/');

function addTo(map, key, value) {
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(value);
}

// The requirements: headings "## REQ-001" in the files under spec/, in the order they are written. Fenced code is not a heading.
function readRequirements(root) {
  const ids = [];
  for (const file of walk(path.join(root, 'spec'))) {
    let fenced = false;
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      if (/^ {0,3}(?:`{3,}|~{3,})/.test(line)) fenced = !fenced;
      else if (!fenced) {
        const heading = line.match(/^ {0,3}##[ \t]+(REQ-\d+)\b/);
        if (heading && !ids.includes(heading[1])) ids.push(heading[1]);
      }
    }
  }
  return ids;
}

// The code: for each ID, the files under src/ that contain it.
function readCode(root) {
  const byId = new Map();
  for (const file of walk(path.join(root, 'src'))) {
    for (const id of new Set(readFileSync(file, 'utf8').match(ID) ?? [])) addTo(byId, id, relative(root, file));
  }
  return byId;
}

// The names of the test(...) and it(...) calls in a source file. Comments are skipped, and so is everything inside a string, so a
// comment or a string that mentions test('REQ-001: ...') is not a test. Each string is swapped for a numbered placeholder first.
function testNames(source) {
  const strings = [];
  let skeleton = '';
  let last = ''; // the last character that is not a space: tells a regular expression from a division
  let i = 0;
  while (i < source.length) {
    const c = source[i];
    const next = source[i + 1];
    if (c === '/' && next === '/') {
      while (i < source.length && source[i] !== '\n') i++;
    } else if (c === '/' && next === '*') {
      const end = source.indexOf('*/', i + 2);
      i = end < 0 ? source.length : end + 2;
      skeleton += ' ';
    } else if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      while (j < source.length && source[j] !== c) j += source[j] === '\\' ? 2 : 1;
      strings.push(source.slice(i + 1, j));
      skeleton += `\0${strings.length - 1}\0`;
      i = j + 1;
      last = c;
    } else if (c === '/' && /^$|[(,=:[!&|?{};]/.test(last)) {
      let j = i + 1;
      let inClass = false;
      while (j < source.length && source[j] !== '\n' && (inClass || source[j] !== '/')) {
        if (source[j] === '\\') j++;
        else if (source[j] === '[') inClass = true;
        else if (source[j] === ']') inClass = false;
        j++;
      }
      i = j + 1;
      skeleton += ' ';
      last = ')';
    } else {
      skeleton += c;
      if (!/\s/.test(c)) last = c;
      i++;
    }
  }
  // test(...) and it(...), also test.only(...). test.skip and test.todo do not match. A call written as foo.test(...) does not either.
  const call = /(?<![\w$.])(?:test|it)(?:\.only)?\s*\(\s*\0(\d+)\0/g;
  return [...skeleton.matchAll(call)].map(m => strings[Number(m[1])]);
}

// The tests: for each ID, the names of the tests that start with it. Also every ID that a test name mentions, for the orphans.
function readTests(root) {
  const named = new Map(); // id -> [{ name, file }]
  const mentioned = new Map(); // id -> Set of files
  for (const file of walk(path.join(root, 'tests')).filter(f => TEST_FILE.test(f))) {
    const where = relative(root, file);
    for (const name of testNames(readFileSync(file, 'utf8'))) {
      const start = name.match(/^\s*(REQ-\d+)\b/);
      if (start) {
        if (!named.has(start[1])) named.set(start[1], []);
        named.get(start[1]).push({ name: name.trim(), file: where });
      }
      for (const id of new Set(name.match(ID) ?? [])) addTo(mentioned, id, where);
    }
  }
  return { named, mentioned };
}

function gitList(root, args) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).split('\n').filter(Boolean);
  } catch (error) {
    const reason = String(error.stderr || error.message).trim().split('\n')[0];
    die(`git could not compare with the base: ${reason}`);
  }
}

// Drift: a file under src/ changed since <ref>, and nothing under spec/ did. New files that git does not track yet count as changes.
function checkDrift(root, ref) {
  const changed = new Set([
    ...gitList(root, ['diff', '--name-only', '--relative', ref, '--']),
    ...gitList(root, ['ls-files', '--others', '--exclude-standard']),
  ]);
  const src = [...changed].filter(f => f.startsWith('src/')).sort();
  const spec = [...changed].filter(f => f.startsWith('spec/')).sort();
  return { base: ref, status: src.length && !spec.length ? 'DRIFT' : 'ok', src, spec };
}

function statusOf(code, tests) {
  const missing = [!code.length && 'no code', !tests.length && 'no test'].filter(Boolean);
  return missing.length ? `GAP: ${missing.join(', ')}` : 'traced';
}

function printTable(rows) {
  const widths = rows[0].map((_, col) => Math.max(...rows.map(r => r[col].length)));
  const line = row => `| ${row.map((cell, col) => cell.padEnd(widths[col])).join(' | ')} |`;
  console.log(line(rows[0]));
  console.log(`|${widths.map(w => '-'.repeat(w + 2)).join('|')}|`);
  rows.slice(1).forEach(row => console.log(line(row)));
}

const opts = parseArgs(process.argv.slice(2));
const { root } = opts;
if (!existsSync(root) || !statSync(root).isDirectory()) die(`${root} is not a folder`);

const ids = readRequirements(root);
const code = readCode(root);
const { named, mentioned } = readTests(root);

const requirements = ids.map(id => {
  const files = [...(code.get(id) ?? [])].sort();
  const tests = named.get(id) ?? [];
  return { id, code: files, tests: tests.map(t => t.name), testFiles: [...new Set(tests.map(t => t.file))].sort(), status: statusOf(files, tests) };
});

const orphans = [...new Set([...code.keys(), ...mentioned.keys()])]
  .filter(id => !ids.includes(id))
  .sort()
  .map(id => ({ id, files: [...new Set([...(code.get(id) ?? []), ...(mentioned.get(id) ?? [])])].sort() }));

const drift = opts.base ? checkDrift(root, opts.base) : null;
const gaps = requirements.filter(r => r.status !== 'traced');
const ok = ids.length > 0 && !gaps.length && !orphans.length && drift?.status !== 'DRIFT';

if (opts.json) {
  const report = { ok, requirements: requirements.map(({ testFiles, ...r }) => r), orphans };
  if (drift) report.drift = drift;
  console.log(JSON.stringify(report, null, 2));
} else {
  if (!ids.length) {
    console.log(`No requirements found. A requirement is a heading like "## REQ-001" in a file under spec/ (looked in ${root}).`);
  } else {
    printTable([
      ['Requirement', 'Code', 'Tests', 'Status'],
      ...requirements.map(r => [r.id, r.code.join(', ') || '-', r.tests.length ? `${r.tests.length} in ${r.testFiles.join(', ')}` : '-', r.status]),
    ]);
  }
  for (const o of orphans) console.log(`ORPHAN: ${o.id} appears in ${o.files.join(', ')} but is not a requirement in spec/`);
  if (drift?.status === 'DRIFT') {
    console.log(`DRIFT: src/ changed since ${drift.base} and nothing under spec/ did: ${drift.src.join(', ')}`);
  } else if (drift) {
    console.log(`Compared with ${drift.base}: ${drift.src.length ? 'src/ and spec/ changed together' : 'nothing changed under src/'}.`);
  }
  if (ids.length) {
    console.log(ok ? `All ${ids.length} requirements are traced.` : `${gaps.length} of ${ids.length} requirements have gaps, ${orphans.length} orphans.`);
  }
}
process.exit(ok ? 0 : 1);

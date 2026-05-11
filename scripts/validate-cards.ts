import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import Ajv, { type ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import yaml from 'js-yaml';

const ROOT = process.cwd();
const CARDS_DIR = join(ROOT, 'content', 'cards');
const SCHEMA_PATH = join(ROOT, 'content', 'card-schema.json');

if (!existsSync(SCHEMA_PATH)) {
  console.error(`Schema not found: ${SCHEMA_PATH}`);
  process.exit(1);
}

const schema = JSON.parse(readFileSync(SCHEMA_PATH, 'utf8'));
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(schema);

if (!existsSync(CARDS_DIR)) {
  console.error(`Cards directory not found: ${CARDS_DIR}`);
  process.exit(1);
}

const files = readdirSync(CARDS_DIR).filter(
  (f) => f.endsWith('.yaml') || f.endsWith('.yml'),
);

if (files.length === 0) {
  console.log('No card files in content/cards/ yet — nothing to validate.');
  process.exit(0);
}

let totalCards = 0;
const failures: { file: string; reason: string }[] = [];

for (const file of files) {
  const filepath = join(CARDS_DIR, file);
  const raw = readFileSync(filepath, 'utf8');

  let data: unknown;
  try {
    data = yaml.load(raw);
  } catch (e) {
    const msg = (e as Error).message;
    console.error(`✗ ${file} — YAML parse error: ${msg}`);
    failures.push({ file, reason: `YAML parse error: ${msg}` });
    continue;
  }

  if (validate(data)) {
    const count = Array.isArray(data) ? data.length : 0;
    totalCards += count;
    console.log(`✓ ${file} — ${count} card${count === 1 ? '' : 's'}`);
  } else {
    console.error(`✗ ${file} — schema violations:`);
    for (const err of (validate.errors ?? []) as ErrorObject[]) {
      console.error(`    ${err.instancePath || '/'} ${err.message}`);
    }
    failures.push({ file, reason: 'schema violation' });
  }
}

console.log('');
console.log('— Summary —');
console.log(`Files checked: ${files.length}`);
console.log(`Cards validated: ${totalCards}`);
console.log(`Failures: ${failures.length}`);

if (failures.length > 0) {
  console.log(`Failed files: ${failures.map((f) => f.file).join(', ')}`);
  process.exit(1);
}

process.exit(0);

import yaml from 'js-yaml';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from '../../content/card-schema.json';
import type { Card } from './types';

const rawFiles = import.meta.glob('../../content/cards/*.yaml', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(schema);

function loadCards(): Card[] {
  const all: Card[] = [];
  const entries = Object.entries(rawFiles).sort(([a], [b]) => a.localeCompare(b));

  for (const [path, raw] of entries) {
    let parsed: unknown;
    try {
      parsed = yaml.load(raw);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`[cards] YAML parse error in ${path}: ${msg}`);
    }

    if (!validate(parsed)) {
      const issues = (validate.errors ?? [])
        .map((e) => `  ${e.instancePath || '/'} ${e.message ?? 'invalid'}`)
        .join('\n');
      throw new Error(`[cards] Schema validation failed for ${path}:\n${issues}`);
    }

    all.push(...(parsed as Card[]));
  }

  return all;
}

export const cards: Card[] = loadCards();

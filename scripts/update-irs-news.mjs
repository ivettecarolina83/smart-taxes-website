import { readFile, writeFile } from 'node:fs/promises';

const SOURCE = 'https://www.irs.gov/newsroom';
const OUTPUT = new URL('../data/irs-news.json', import.meta.url);
const LIMIT = 6;

const response = await fetch(SOURCE, {
  headers: {
    Accept: 'text/html,application/xhtml+xml',
    'User-Agent': 'SmartTaxesNewsUpdater/1.0 (+https://smartaxesusa.com)',
  },
  signal: AbortSignal.timeout(20000),
});

if (!response.ok) throw new Error(`IRS Newsroom returned ${response.status}`);
const html = await response.text();

const decode = (value) =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&mdash;|&#8212;/gi, '—')
    .replace(/&ndash;|&#8211;/gi, '–')
    .replace(/\s+/g, ' ')
    .trim();

const matches = [...html.matchAll(
  /<h3[^>]*>[\s\S]*?<a[^>]+href="(\/newsroom\/[^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h3>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/gi
)];

const items = matches.slice(0, LIMIT).map((match) => {
  const detail = decode(match[3]);
  const parts = detail.match(/^(?:IR-\d{4}-\d+,\s*)?([A-Z][a-z]{2}\.\s+\d{1,2},\s+\d{4})\s*[—–-]\s*(.+)$/u);
  return {
    title: decode(match[2]),
    date: parts?.[1] || '',
    summary: parts?.[2] || detail,
    url: new URL(match[1], 'https://www.irs.gov').href,
  };
}).filter((item) => {
  const url = new URL(item.url);
  return item.title && item.summary && url.protocol === 'https:' &&
    ['irs.gov', 'www.irs.gov'].includes(url.hostname);
});

if (items.length < 3) throw new Error('IRS Newsroom structure changed; existing JSON was preserved.');

let existing = null;
try { existing = JSON.parse(await readFile(OUTPUT, 'utf8')); } catch {}
const next = {
  source: 'Internal Revenue Service',
  source_url: SOURCE,
  updated_at: new Date().toISOString(),
  items,
};

if (existing && JSON.stringify(existing.items) === JSON.stringify(next.items)) {
  console.log('No IRS news changes.');
  process.exit(0);
}

await writeFile(OUTPUT, JSON.stringify(next, null, 2) + '\n', 'utf8');
console.log(`Updated ${items.length} IRS news items.`);

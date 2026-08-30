import { readFile, writeFile } from 'node:fs/promises';

const SOURCES = {
  en: 'https://www.irs.gov/newsroom',
  es: 'https://www.irs.gov/es/newsroom',
};
const OUTPUT = new URL('../irs-news.json', import.meta.url);
const LIMIT = 3;

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

async function fetchLocale(language, source) {
  const response = await fetch(source, {
    headers: {
      Accept: 'text/html,application/xhtml+xml',
      'User-Agent': 'SmartTaxesNewsUpdater/2.0 (+https://smartaxesusa.com)',
    },
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) throw new Error(`${language} IRS Newsroom returned ${response.status}`);
  const html = await response.text();
  const prefix = language === 'es' ? '/es/newsroom/' : '/newsroom/';
  const pattern = new RegExp(
    '<div[^>]+class="[^"]*views-row[^"]*"[^>]*>[\\s\\S]*?' +
      '<h3[^>]*>[\\s\\S]*?<a[^>]+href="(' + prefix.replaceAll('/', '\\/') +
      '[^"]+)"[^>]*>([\\s\\S]*?)<\\/a>[\\s\\S]*?<\\/h3>[\\s\\S]*?' +
      '<div[^>]+class="[^"]*views-field-field-pup-description-abstract[^"]*"[^>]*>[\\s\\S]*?' +
      '(?:<p[^>]*>|<div[^>]+class="[^"]*field-content[^"]*"[^>]*>)' +
      '([\\s\\S]*?)(?:<\\/p>|<\\/div>)',
    'gi'
  );

  const matches = [...html.matchAll(pattern)];
  const items = matches.slice(0, LIMIT).map((match) => {
    const detail = decode(match[3]);
    const separator = detail.match(/^(?:IR-\d{4}-\d+(?:SP)?,\s*)?(.+?)\s*[—–]\s*(.+)$/u);
    return {
      title: decode(match[2]),
      date: separator?.[1] || '',
      summary: separator?.[2] || detail,
      url: new URL(match[1], 'https://www.irs.gov').href,
    };
  }).filter((item) => {
    const url = new URL(item.url);
    const expectedPath = language === 'es' ? '/es/newsroom/' : '/newsroom/';
    return item.title && item.summary && url.protocol === 'https:' &&
      ['irs.gov', 'www.irs.gov'].includes(url.hostname) &&
      url.pathname.startsWith(expectedPath);
  });

  if (items.length < 3) {
    throw new Error(`${language} IRS Newsroom structure changed; existing JSON was preserved.`);
  }
  return items;
}

const [english, spanish] = await Promise.all([
  fetchLocale('en', SOURCES.en),
  fetchLocale('es', SOURCES.es),
]);

let existing = null;
try { existing = JSON.parse(await readFile(OUTPUT, 'utf8')); } catch {}

const spanishByCanonicalUrl = new Map(
  spanish.map((item) => [item.url.replace('https://www.irs.gov/es', 'https://www.irs.gov'), item])
);
const spanishDisplay = english.map((item) => spanishByCanonicalUrl.get(item.url) || item);

const next = {
  source: 'Internal Revenue Service',
  source_urls: SOURCES,
  updated_at: new Date().toISOString(),
  locales: { en: english, es: spanishDisplay },
};

if (existing && JSON.stringify(existing.locales) === JSON.stringify(next.locales)) {
  console.log('No IRS news changes.');
  process.exit(0);
}

await writeFile(OUTPUT, JSON.stringify(next, null, 2) + '\n', 'utf8');
console.log(`Updated ${english.length} latest IRS items with ${spanish.length} official Spanish releases available.`);

<?php
declare(strict_types=1);

const IRS_NEWSROOM_URL = 'https://www.irs.gov/newsroom';
const IRS_NEWS_CACHE_TTL = 3600;
const IRS_NEWS_ITEM_LIMIT = 6;

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: public, max-age=300, stale-while-revalidate=3600');
header('X-Content-Type-Options: nosniff');

$cacheFile = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'smart-taxes-irs-news-v1.json';
$cached = readCache($cacheFile);

if ($cached !== null && (time() - (int) $cached['saved_at']) < IRS_NEWS_CACHE_TTL) {
    sendPayload($cached['payload'], true);
}

try {
    $html = fetchNewsroom(IRS_NEWSROOM_URL);
    $items = parseNewsroom($html);

    if (count($items) === 0) {
        throw new RuntimeException('No se encontraron noticias oficiales.');
    }

    $payload = [
        'source' => 'Internal Revenue Service',
        'source_url' => IRS_NEWSROOM_URL,
        'fetched_at' => gmdate('c'),
        'items' => $items,
    ];

    writeCache($cacheFile, $payload);
    sendPayload($payload, false);
} catch (Throwable $error) {
    if ($cached !== null) {
        sendPayload($cached['payload'], true);
    }

    http_response_code(502);
    echo json_encode([
        'error' => 'Las noticias oficiales no están disponibles temporalmente.',
        'source_url' => IRS_NEWSROOM_URL,
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function fetchNewsroom(string $url): string
{
    if (function_exists('curl_init')) {
        $handle = curl_init($url);
        curl_setopt_array($handle, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS => 3,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_USERAGENT => 'SmartTaxesNews/1.0 (+https://smartaxesusa.com)',
            CURLOPT_HTTPHEADER => ['Accept: text/html,application/xhtml+xml'],
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
        ]);
        $body = curl_exec($handle);
        $status = (int) curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
        $failure = curl_error($handle);
        curl_close($handle);

        if (!is_string($body) || $status !== 200) {
            throw new RuntimeException('IRS Newsroom request failed: ' . $status . ' ' . $failure);
        }

        return $body;
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 10,
            'header' => "User-Agent: SmartTaxesNews/1.0 (+https://smartaxesusa.com)\r\nAccept: text/html,application/xhtml+xml\r\n",
        ],
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
        ],
    ]);
    $body = @file_get_contents($url, false, $context);

    if (!is_string($body)) {
        throw new RuntimeException('IRS Newsroom request failed.');
    }

    return $body;
}

function parseNewsroom(string $html): array
{
    $document = new DOMDocument();
    $previous = libxml_use_internal_errors(true);
    $loaded = $document->loadHTML($html, LIBXML_NONET | LIBXML_NOERROR | LIBXML_NOWARNING);
    libxml_clear_errors();
    libxml_use_internal_errors($previous);

    if (!$loaded) {
        throw new RuntimeException('Could not parse IRS Newsroom.');
    }

    $xpath = new DOMXPath($document);
    $headings = $xpath->query('//h2[contains(normalize-space(.), "Latest news releases")]/following::h3[a[starts-with(@href, "/newsroom/")]]');

    if ($headings === false || $headings->length === 0) {
        $headings = $xpath->query('//h3[a[starts-with(@href, "/newsroom/")]]');
    }

    $items = [];
    foreach ($headings as $heading) {
        if (count($items) >= IRS_NEWS_ITEM_LIMIT) {
            break;
        }

        $link = $xpath->query('.//a[starts-with(@href, "/newsroom/")]', $heading)->item(0);
        if (!$link instanceof DOMElement) {
            continue;
        }

        $url = officialIrsUrl($link->getAttribute('href'));
        $title = cleanText($link->textContent);
        $detail = nextUsefulText($heading);
        if ($url === null || $title === '' || $detail === '') {
            continue;
        }

        [$date, $summary] = splitDetail($detail);
        $items[] = [
            'title' => $title,
            'date' => $date,
            'summary' => $summary,
            'url' => $url,
        ];
    }

    return $items;
}

function nextUsefulText(DOMNode $node): string
{
    $candidate = $node->nextSibling;
    while ($candidate !== null) {
        if ($candidate instanceof DOMElement && preg_match('/^H[1-6]$/', $candidate->tagName)) {
            return '';
        }

        $text = cleanText($candidate->textContent ?? '');
        if ($text !== '') {
            return $text;
        }
        $candidate = $candidate->nextSibling;
    }
    return '';
}

function splitDetail(string $detail): array
{
    if (preg_match('/^(?:IR-\d{4}-\d+,\s*)?([A-Z][a-z]{2}\.\s+\d{1,2},\s+\d{4})\s*[—–-]\s*(.+)$/u', $detail, $matches)) {
        return [$matches[1], cleanText($matches[2])];
    }

    return ['', $detail];
}

function officialIrsUrl(string $path): ?string
{
    $url = str_starts_with($path, '/') ? 'https://www.irs.gov' . $path : $path;
    $parts = parse_url($url);
    $host = strtolower((string) ($parts['host'] ?? ''));
    $scheme = strtolower((string) ($parts['scheme'] ?? ''));

    if ($scheme !== 'https' || !in_array($host, ['irs.gov', 'www.irs.gov'], true)) {
        return null;
    }

    return $url;
}

function cleanText(string $value): string
{
    return trim((string) preg_replace('/\s+/u', ' ', html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8')));
}

function readCache(string $path): ?array
{
    if (!is_file($path) || !is_readable($path)) {
        return null;
    }

    $data = json_decode((string) @file_get_contents($path), true);
    if (!is_array($data) || !isset($data['saved_at'], $data['payload']['items'])) {
        return null;
    }

    return $data;
}

function writeCache(string $path, array $payload): void
{
    $encoded = json_encode([
        'saved_at' => time(),
        'payload' => $payload,
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    if (is_string($encoded)) {
        @file_put_contents($path, $encoded, LOCK_EX);
    }
}

function sendPayload(array $payload, bool $cached): never
{
    $payload['cached'] = $cached;
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

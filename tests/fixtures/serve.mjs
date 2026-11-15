/**
 * سيرفر ثابت صغير لاختبارات E2E.
 * مهم: content_scripts لا تعمل على file:// افتراضيًا، поэтому الاختبارات تحتاج http://.
 * التشغيل: node tests/fixtures/serve.mjs  (يستخدم في playwright.config.ts → webServer)
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.FIXTURE_PORT || 4599);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const path = normalize(join(ROOT, url.pathname === '/' ? '/long.html' : url.pathname));
  if (!path.startsWith(ROOT)) { res.writeHead(403).end('forbidden'); return; }
  try {
    const body = await readFile(path);
    res.writeHead(200, { 'content-type': TYPES[extname(path)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
}).listen(PORT, () => console.log(`[fixtures] http://localhost:${PORT}`));

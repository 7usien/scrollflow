// scripts/export-icons.js — Renders high-res SVG master icon to all required PNG icon sizes
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const svgPath = path.join(rootDir, 'store-assets', 'icon.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

const targets = [
  { size: 16, outPath: path.join(rootDir, 'public', 'icons', 'icon16.png') },
  { size: 32, outPath: path.join(rootDir, 'public', 'icons', 'icon32.png') },
  { size: 48, outPath: path.join(rootDir, 'public', 'icons', 'icon48.png') },
  { size: 128, outPath: path.join(rootDir, 'public', 'icons', 'icon128.png') },
  { size: 128, outPath: path.join(rootDir, 'store-assets', 'icon128.png') },
  { size: 512, outPath: path.join(rootDir, 'store-assets', 'icon512.png') },
];

async function run() {
  const chromePath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: false,
    args: ['--headless=new', '--no-sandbox'],
  });
  const page = await browser.newPage();

  for (const { size, outPath } of targets) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body, html { width: ${size}px; height: ${size}px; overflow: hidden; background: transparent; }
          svg { width: 100%; height: 100%; display: block; }
        </style>
      </head>
      <body>
        ${svgContent}
      </body>
      </html>
    `;

    await page.setViewportSize({ width: size, height: size });
    await page.setContent(html);

    await page.screenshot({
      path: outPath,
      omitBackground: true,
      type: 'png',
    });

    console.log(`Rendered icon ${size}x${size} -> ${path.relative(rootDir, outPath)}`);
  }

  await browser.close();
  console.log('All icons successfully exported.');
}

run().catch((err) => {
  console.error('Error exporting icons:', err);
  process.exit(1);
});

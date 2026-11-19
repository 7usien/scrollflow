// scripts/pack.js — Builds, verifies, and packages the extension into scrollflow-v1.0.0.zip
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const pkgJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const version = pkgJson.version || '1.0.0';
const zipName = `scrollflow-v${version}.zip`;
const zipPath = path.join(rootDir, zipName);
const distPath = path.join(rootDir, 'dist');

console.log(`\n========================================`);
console.log(`📦 Packaging ScrollFlow v${version} for Chrome Web Store`);
console.log(`========================================\n`);

try {
  // 1. Run Verification Suite
  console.log('🔍 Step 1: Running typecheck, lint, and tests...');
  execSync('npm run verify', { cwd: rootDir, stdio: 'inherit' });

  // 2. Build Production Bundle
  console.log('\n🏗️ Step 2: Building clean production bundle...');
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

  // 3. Remove existing zip if any
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
    console.log(`Removed previous archive: ${zipName}`);
  }

  // 4. Compress dist contents into zip
  console.log(`\n🗜️ Step 3: Compressing dist/ contents into ${zipName}...`);
  // On Windows, use PowerShell Compress-Archive
  const psCmd = `powershell -NoProfile -Command "Compress-Archive -Path '${distPath}\\*' -DestinationPath '${zipPath}' -Force"`;
  execSync(psCmd, { cwd: rootDir, stdio: 'inherit' });

  // 5. Inspect zip file size
  const stats = fs.statSync(zipPath);
  const sizeKb = (stats.size / 1024).toFixed(2);

  console.log(`\n✅ Successfully generated Chrome Web Store release package:`);
  console.log(`   📁 File: ${zipName}`);
  console.log(`   ⚖️ Size: ${sizeKb} KB`);
  console.log(`   📍 Path: ${zipPath}`);
  console.log(`\nReady for upload to Chrome Web Store Developer Dashboard!\n`);
} catch (err) {
  console.error('\n❌ Packaging failed:', err.message);
  process.exit(1);
}

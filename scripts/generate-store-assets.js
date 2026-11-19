// scripts/generate-store-assets.js — Generates all official Chrome Web Store promo tiles and screenshots
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'store-assets');

const chromePath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const assets = [
  // 1. Small Promo Tile (440x280)
  {
    name: 'promo-small-440x280.png',
    width: 440,
    height: 280,
    renderHtml: () => `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body {
            width: 440px; height: 280px; overflow: hidden;
            background: radial-gradient(circle at 80% 20%, #1a1738 0%, #0a0c16 60%, #05070d 100%);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
            color: #ffffff; position: relative; display: flex; align-items: center; justify-content: space-between;
            padding: 32px 36px; border: 1px solid rgba(255,255,255,0.08);
          }
          .ambient-glow {
            position: absolute; width: 260px; height: 260px; border-radius: 50%;
            background: radial-gradient(circle, #6d5bff 0%, rgba(0,212,255,0.4) 50%, transparent 70%);
            filter: blur(50px); opacity: 0.35; top: -40px; right: 20px; pointer-events: none;
          }
          .brand-col {
            position: relative; z-index: 2; max-width: 250px;
          }
          .badge {
            display: inline-flex; align-items: center; gap: 6px;
            padding: 4px 10px; border-radius: 999px;
            background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
            font-size: 10px; font-weight: 700; color: #00d4ff; text-transform: uppercase; letter-spacing: 0.08em;
            margin-bottom: 12px;
          }
          .title {
            font-size: 32px; font-weight: 800; line-height: 1.1; letter-spacing: -0.02em;
            background: linear-gradient(135deg, #ffffff 40%, #00d4ff 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            margin-bottom: 8px;
          }
          .subtitle {
            font-size: 13px; line-height: 1.45; color: #9aa3b8; font-weight: 500;
          }
          .feature-pills {
            display: flex; gap: 6px; margin-top: 16px; flex-wrap: wrap;
          }
          .pill {
            font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 6px;
            background: rgba(109, 91, 255, 0.15); border: 1px solid rgba(109, 91, 255, 0.3);
            color: #d8d4ff;
          }
          .preview-col {
            position: relative; z-index: 2; display: flex; align-items: center; justify-content: center;
          }
          .rail-mockup {
            width: 14px; height: 190px; border-radius: 999px;
            background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.18);
            position: relative; box-shadow: 0 8px 24px rgba(0,0,0,0.5);
          }
          .rail-fill {
            position: absolute; top: 0; left: 0; width: 100%; height: 68%; border-radius: 999px;
            background: linear-gradient(180deg, #6d5bff, #4e8cff, #00d4ff);
            box-shadow: 0 0 12px rgba(0, 212, 255, 0.6);
          }
          .thumb {
            position: absolute; top: 68%; left: 50%; transform: translate(-50%, -50%);
            width: 22px; height: 22px; border-radius: 50%;
            background: #ffffff; box-shadow: 0 0 14px 4px #00d4ff;
          }
          .marker-1 {
            position: absolute; top: 32%; left: 50%; transform: translate(-50%, -50%);
            width: 14px; height: 14px; border-radius: 50%;
            background: #ffd166; border: 2px solid #ffffff; box-shadow: 0 0 8px #ffd166;
          }
          .marker-tab {
            position: absolute; top: 50%; right: 50%; transform: translateY(-50%);
            width: 10px; height: 4px; background: #ffd166; border-radius: 2px 0 0 2px;
          }
          .pct-bubble {
            position: absolute; top: 68%; right: 30px; transform: translateY(-50%);
            background: rgba(17, 20, 32, 0.85); border: 1px solid rgba(255, 255, 255, 0.18);
            padding: 4px 8px; border-radius: 8px; font-size: 11px; font-weight: 700; color: #ffffff;
            backdrop-filter: blur(8px); white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          }
        </style>
      </head>
      <body>
        <div class="ambient-glow"></div>
        <div class="brand-col">
          <div class="badge">✦ Chrome Extension</div>
          <h1 class="title">ScrollFlow</h1>
          <p class="subtitle">Smart Reading Progress Indicator, Highlight Margins & Auto-TOC</p>
          <div class="feature-pills">
            <span class="pill">60 FPS Smooth</span>
            <span class="pill">Zero Tracking</span>
            <span class="pill">Markdown Export</span>
          </div>
        </div>
        <div class="preview-col">
          <div class="pct-bubble">68%</div>
          <div class="rail-mockup">
            <div class="rail-fill"></div>
            <div class="marker-1"><div class="marker-tab"></div></div>
            <div class="thumb"></div>
          </div>
        </div>
      </body>
      </html>
    `
  },

  // 2. Marquee Promo Tile (1400x560)
  {
    name: 'promo-marquee-1400x560.png',
    width: 1400,
    height: 560,
    renderHtml: () => `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body {
            width: 1400px; height: 560px; overflow: hidden;
            background: radial-gradient(circle at 75% 30%, #1e1948 0%, #0d0f1e 50%, #05060c 100%);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
            color: #ffffff; position: relative; display: flex; align-items: center; justify-content: space-between;
            padding: 60px 90px;
          }
          .ambient-1 {
            position: absolute; width: 600px; height: 600px; border-radius: 50%;
            background: radial-gradient(circle, #6d5bff 0%, transparent 65%);
            filter: blur(90px); opacity: 0.35; top: -150px; right: 280px; pointer-events: none;
          }
          .ambient-2 {
            position: absolute; width: 500px; height: 500px; border-radius: 50%;
            background: radial-gradient(circle, #00d4ff 0%, transparent 65%);
            filter: blur(80px); opacity: 0.25; bottom: -120px; right: 80px; pointer-events: none;
          }
          .left-content {
            position: relative; z-index: 2; max-width: 660px;
          }
          .kicker {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 6px 14px; border-radius: 999px;
            background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18);
            font-size: 13px; font-weight: 700; color: #00d4ff; text-transform: uppercase; letter-spacing: 0.08em;
            margin-bottom: 22px;
          }
          .title {
            font-size: 58px; font-weight: 800; line-height: 1.08; letter-spacing: -0.03em;
            background: linear-gradient(135deg, #ffffff 40%, #00d4ff 90%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            margin-bottom: 18px;
          }
          .desc {
            font-size: 20px; line-height: 1.5; color: #a4b0c6; font-weight: 400; margin-bottom: 34px;
          }
          .grid-features {
            display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px 20px;
          }
          .feat-item {
            display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 600; color: #e2e8f0;
          }
          .feat-icon {
            width: 26px; height: 26px; border-radius: 7px; background: rgba(109, 91, 255, 0.2);
            border: 1px solid rgba(109, 91, 255, 0.4); display: flex; align-items: center; justify-content: center;
            color: #00d4ff; font-size: 13px; flex-shrink: 0;
          }
          .right-mockup {
            position: relative; z-index: 2; width: 440px; height: 420px;
            background: rgba(18, 22, 38, 0.65); border: 1px solid rgba(255, 255, 255, 0.14);
            border-radius: 20px; backdrop-filter: blur(20px); box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            padding: 24px; display: flex; flex-direction: column; justify-content: space-between;
          }
          .mockup-header {
            display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08);
            padding-bottom: 14px;
          }
          .mockup-dots { display: flex; gap: 6px; }
          .dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.2); }
          .mockup-title { font-size: 12px; color: #94a3b8; font-weight: 600; }
          .mockup-body {
            position: relative; flex: 1; padding: 20px 0; display: flex; gap: 24px;
          }
          .article-sim {
            flex: 1; display: flex; flex-direction: column; gap: 12px;
          }
          .text-line {
            height: 10px; border-radius: 5px; background: rgba(255,255,255,0.12);
          }
          .text-line.hl {
            background: rgba(0, 212, 255, 0.25); border: 1px dashed rgba(0, 212, 255, 0.6);
          }
          .mockup-rail {
            width: 10px; height: 100%; border-radius: 999px; background: rgba(255,255,255,0.12);
            position: relative; flex-shrink: 0;
          }
          .mockup-rail-fill {
            position: absolute; top: 0; width: 100%; height: 60%; border-radius: 999px;
            background: linear-gradient(180deg, #6d5bff, #00d4ff);
          }
          .mockup-thumb {
            position: absolute; top: 60%; left: 50%; transform: translate(-50%, -50%);
            width: 18px; height: 18px; border-radius: 50%; background: #ffffff;
            box-shadow: 0 0 12px #00d4ff;
          }
          .mockup-marker {
            position: absolute; top: 28%; left: 50%; transform: translate(-50%, -50%);
            width: 12px; height: 12px; border-radius: 50%; background: #06d6a0;
            border: 2px solid #ffffff; box-shadow: 0 0 8px #06d6a0;
          }
          .bubble-tag {
            position: absolute; top: 38%; left: 45px;
            background: rgba(26, 32, 54, 0.95); border: 1px solid rgba(255,255,255,0.2);
            padding: 6px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; color: #ffffff;
            box-shadow: 0 8px 24px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 8px;
          }
          .color-row { display: flex; gap: 4px; }
          .c-dot { width: 9px; height: 9px; border-radius: 50%; }
        </style>
      </head>
      <body>
        <div class="ambient-1"></div>
        <div class="ambient-2"></div>
        <div class="left-content">
          <div class="kicker">⚡ The Next-Gen Reading Experience</div>
          <h1 class="title">Read with Flow.<br>Never lose your place.</h1>
          <p class="desc">A lightweight, aesthetic vertical reading indicator with interactive marginalia, automatic headings index, and instant Markdown export.</p>
          <div class="grid-features">
            <div class="feat-item"><div class="feat-icon">📊</div> 60 FPS Fluid Reading Progress</div>
            <div class="feat-item"><div class="feat-icon">📑</div> Auto-Generated Table of Contents</div>
            <div class="feat-item"><div class="feat-icon">🔖</div> Highlight Margins & 5 Categories</div>
            <div class="feat-item"><div class="feat-icon">📋</div> 1-Click Notion/Markdown Export</div>
            <div class="feat-item"><div class="feat-icon">🧘</div> Zen Auto-Hide Distraction-Free Mode</div>
            <div class="feat-item"><div class="feat-icon">🔒</div> 100% Private — Zero Network Calls</div>
          </div>
        </div>
        <div class="right-mockup">
          <div class="mockup-header">
            <div class="mockup-dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
            <div class="mockup-title">ScrollFlow Live Preview</div>
            <div style="width:20px"></div>
          </div>
          <div class="mockup-body">
            <div class="article-sim">
              <div class="text-line" style="width:60%; height:14px; background:rgba(255,255,255,0.3)"></div>
              <div class="text-line" style="width:90%"></div>
              <div class="text-line" style="width:85%"></div>
              <div class="text-line hl" style="width:95%"></div>
              <div class="text-line" style="width:80%"></div>
              <div class="text-line" style="width:75%"></div>
              <div class="text-line" style="width:88%"></div>
            </div>
            <div class="bubble-tag">
              <span>🔖 Add Margin</span>
              <div class="color-row">
                <span class="c-dot" style="background:#ffd166"></span>
                <span class="c-dot" style="background:#06d6a0"></span>
                <span class="c-dot" style="background:#b5179e"></span>
                <span class="c-dot" style="background:#00d4ff"></span>
                <span class="c-dot" style="background:#ff4d6d"></span>
              </div>
            </div>
            <div class="mockup-rail">
              <div class="mockup-rail-fill"></div>
              <div class="mockup-marker"></div>
              <div class="mockup-thumb"></div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  },

  // 3. Screenshot 1: Live Progress & Themes (1280x800)
  {
    name: 'screenshot-1-progress-themes-1280x800.png',
    width: 1280,
    height: 800,
    renderHtml: () => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body {
            width: 1280px; height: 800px; overflow: hidden;
            background: #090b14;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans Arabic", sans-serif;
            color: #ffffff; display: flex; flex-direction: column;
          }
          .banner-header {
            padding: 30px 48px; background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%);
            display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          .headline-title { font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; }
          .headline-subtitle { font-size: 15px; color: #00d4ff; font-weight: 600; margin-top: 4px; }
          .badge-step {
            padding: 6px 14px; border-radius: 999px; background: rgba(0, 212, 255, 0.12);
            border: 1px solid rgba(0, 212, 255, 0.3); font-size: 13px; font-weight: 700; color: #00d4ff;
          }
          .browser-viewport {
            flex: 1; margin: 24px 48px 36px; border-radius: 16px;
            background: #0f1220; border: 1px solid rgba(255,255,255,0.12);
            box-shadow: 0 24px 60px rgba(0,0,0,0.6); display: flex; flex-direction: column; overflow: hidden; position: relative;
          }
          .browser-nav {
            height: 42px; background: #161a2e; border-bottom: 1px solid rgba(255,255,255,0.08);
            display: flex; align-items: center; padding: 0 16px; gap: 14px;
          }
          .nav-dots { display: flex; gap: 7px; }
          .nav-dot { width: 11px; height: 11px; border-radius: 50%; }
          .nav-url {
            flex: 1; max-width: 440px; height: 26px; border-radius: 6px; background: rgba(0,0,0,0.25);
            display: flex; align-items: center; padding: 0 12px; font-size: 12px; color: #94a3b8;
          }
          .browser-content {
            flex: 1; padding: 40px 100px; display: flex; justify-content: space-between; position: relative;
          }
          .article-text { max-width: 680px; }
          .art-h1 { font-size: 32px; font-weight: 800; margin-bottom: 16px; line-height: 1.3; color: #f1f5f9; }
          .art-p { font-size: 15px; line-height: 1.8; color: #94a3b8; margin-bottom: 20px; }
          .sf-rail-wrap {
            position: absolute; right: 28px; top: 80px; height: 420px; width: 10px;
            background: rgba(255,255,255,0.12); border-radius: 999px;
          }
          .sf-rail-fill {
            position: absolute; top: 0; width: 100%; height: 55%; border-radius: 999px;
            background: linear-gradient(180deg, #6d5bff, #4e8cff, #00d4ff);
            box-shadow: 0 0 14px rgba(0, 212, 255, 0.7);
          }
          .sf-thumb {
            position: absolute; top: 55%; left: 50%; transform: translate(-50%, -50%);
            width: 20px; height: 20px; border-radius: 50%; background: #ffffff;
            box-shadow: 0 0 16px 4px #00d4ff;
          }
          .sf-pct-label {
            position: absolute; top: 55%; right: 28px; transform: translateY(-50%);
            background: rgba(15, 18, 32, 0.9); border: 1px solid rgba(255,255,255,0.2);
            padding: 5px 10px; border-radius: 8px; font-size: 12px; font-weight: 700; color: #ffffff;
            backdrop-filter: blur(12px); box-shadow: 0 4px 16px rgba(0,0,0,0.5);
          }
          .theme-showcase {
            position: absolute; bottom: 20px; left: 100px; display: flex; gap: 12px; align-items: center;
          }
          .theme-pill {
            padding: 6px 14px; border-radius: 8px; font-size: 11px; font-weight: 700;
            background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
            display: flex; align-items: center; gap: 6px; color: #cbd5e1;
          }
          .theme-color { width: 10px; height: 10px; border-radius: 50%; }
        </style>
      </head>
      <body>
        <div class="banner-header">
          <div>
            <div class="headline-title">Fluid Reading Progress Bar & Ambient Themes</div>
            <div class="headline-subtitle">مؤشر تقدّم قراءة رأسي حيّ فائق السلاسة (60 FPS) مع 6 ثيمات لونية فاخرة</div>
          </div>
          <div class="badge-step">01 / FEATURE SHOWCASE</div>
        </div>
        <div class="browser-viewport">
          <div class="browser-nav">
            <div class="nav-dots">
              <div class="nav-dot" style="background:#ff5f56"></div>
              <div class="nav-dot" style="background:#ffbd2e"></div>
              <div class="nav-dot" style="background:#27c93f"></div>
            </div>
            <div class="nav-url">🔒 https://example.com/deep-dive-article</div>
          </div>
          <div class="browser-content">
            <div class="article-text">
              <h1 class="art-h1">The Architectural Evolution of Next-Generation Web Interfaces</h1>
              <p class="art-p">Modern reading environments require effortless spatial awareness. Instead of rigid, intrusive scrollbars, subtle ambient telemetry allows readers to measure their progress intuitively without friction.</p>
              <p class="art-p">ScrollFlow introduces zero-latency Lerp smoothing that calculates micro-scroll intervals and renders precise progression in real-time, coupled with an aesthetic frosted glass rail that adapts smoothly to dark and light reading environments.</p>
            </div>
            <div class="sf-rail-wrap">
              <div class="sf-rail-fill"></div>
              <div class="sf-thumb"></div>
              <div class="sf-pct-label">55%</div>
            </div>
            <div class="theme-showcase">
              <span style="font-size:12px; color:#94a3b8; font-weight:600">6 Curated Themes:</span>
              <div class="theme-pill"><div class="theme-color" style="background:linear-gradient(135deg,#6d5bff,#00d4ff)"></div> Aurora</div>
              <div class="theme-pill"><div class="theme-color" style="background:linear-gradient(135deg,#ff6b9a,#ffb86b)"></div> Sunset</div>
              <div class="theme-pill"><div class="theme-color" style="background:linear-gradient(135deg,#00f5d4,#7b2cbf)"></div> Cyberpunk</div>
              <div class="theme-pill"><div class="theme-color" style="background:linear-gradient(135deg,#e2e8f0,#64748b)"></div> Minimal</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  },

  // 4. Screenshot 2: Marginalia & 5-Color Categories (1280x800)
  {
    name: 'screenshot-2-margins-colors-1280x800.png',
    width: 1280,
    height: 800,
    renderHtml: () => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body {
            width: 1280px; height: 800px; overflow: hidden;
            background: #090b14;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans Arabic", sans-serif;
            color: #ffffff; display: flex; flex-direction: column;
          }
          .banner-header {
            padding: 30px 48px; background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%);
            display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          .headline-title { font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; }
          .headline-subtitle { font-size: 15px; color: #ffd166; font-weight: 600; margin-top: 4px; }
          .badge-step {
            padding: 6px 14px; border-radius: 999px; background: rgba(255, 209, 102, 0.12);
            border: 1px solid rgba(255, 209, 102, 0.3); font-size: 13px; font-weight: 700; color: #ffd166;
          }
          .browser-viewport {
            flex: 1; margin: 24px 48px 36px; border-radius: 16px;
            background: #0f1220; border: 1px solid rgba(255,255,255,0.12);
            box-shadow: 0 24px 60px rgba(0,0,0,0.6); display: flex; flex-direction: column; overflow: hidden; position: relative;
          }
          .browser-nav {
            height: 42px; background: #161a2e; border-bottom: 1px solid rgba(255,255,255,0.08);
            display: flex; align-items: center; padding: 0 16px; gap: 14px;
          }
          .nav-dots { display: flex; gap: 7px; }
          .nav-dot { width: 11px; height: 11px; border-radius: 50%; }
          .nav-url {
            flex: 1; max-width: 440px; height: 26px; border-radius: 6px; background: rgba(0,0,0,0.25);
            display: flex; align-items: center; padding: 0 12px; font-size: 12px; color: #94a3b8;
          }
          .browser-content {
            flex: 1; padding: 40px 100px; display: flex; justify-content: space-between; position: relative;
          }
          .article-text { max-width: 680px; }
          .art-h1 { font-size: 32px; font-weight: 800; margin-bottom: 16px; line-height: 1.3; color: #f1f5f9; }
          .art-p { font-size: 15px; line-height: 1.8; color: #94a3b8; margin-bottom: 20px; }
          .hl-green {
            background: rgba(6, 214, 160, 0.22); color: #ffffff; border-radius: 4px; padding: 2px 4px;
            box-shadow: 0 0 10px rgba(6, 214, 160, 0.4);
          }
          .bubble {
            position: absolute; top: 185px; left: 320px;
            background: rgba(22, 27, 46, 0.95); border: 1px solid rgba(255,255,255,0.22);
            border-radius: 999px; padding: 6px 14px; display: flex; align-items: center; gap: 10px;
            box-shadow: 0 12px 32px rgba(0,0,0,0.5); backdrop-filter: blur(12px);
          }
          .bubble-main { font-size: 12px; font-weight: 700; color: #ffffff; display: flex; align-items: center; gap: 5px; }
          .divider { width: 1px; height: 16px; background: rgba(255,255,255,0.2); }
          .swatches { display: flex; gap: 6px; }
          .swatch { width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.5); }
          .sf-rail-wrap {
            position: absolute; right: 28px; top: 80px; height: 420px; width: 10px;
            background: rgba(255,255,255,0.12); border-radius: 999px;
          }
          .sf-marker-dot {
            position: absolute; left: 50%; transform: translate(-50%, -50%);
            width: 14px; height: 14px; border-radius: 50%; border: 2px solid #ffffff;
          }
          .sf-marker-card {
            position: absolute; top: 130px; right: 46px;
            background: rgba(20, 25, 42, 0.95); border: 1px solid rgba(255,255,255,0.18);
            border-radius: 12px; padding: 12px 14px; width: 230px; box-shadow: 0 12px 28px rgba(0,0,0,0.5);
            font-size: 12px; line-height: 1.45; color: #e2e8f0;
          }
          .card-badge { font-size: 10px; font-weight: 700; color: #06d6a0; text-transform: uppercase; margin-bottom: 4px; }
        </style>
      </head>
      <body>
        <div class="banner-header">
          <div>
            <div class="headline-title">Highlight Marginalia & 5 Color-Coded Categories</div>
            <div class="headline-subtitle">أضف هوامش بصرية عند تظليل أي فقرة، وصنفها بخمسة ألوان مع نقاط تنقل رأسية</div>
          </div>
          <div class="badge-step">02 / FEATURE SHOWCASE</div>
        </div>
        <div class="browser-viewport">
          <div class="browser-nav">
            <div class="nav-dots">
              <div class="nav-dot" style="background:#ff5f56"></div>
              <div class="nav-dot" style="background:#ffbd2e"></div>
              <div class="nav-dot" style="background:#27c93f"></div>
            </div>
            <div class="nav-url">🔒 https://example.com/research-notes</div>
          </div>
          <div class="browser-content">
            <div class="article-text">
              <h1 class="art-h1">Continuous Learning Systems & Cognitive Retention</h1>
              <p class="art-p">Research demonstrates that active annotation substantially improves long-term recall compared to passive scrolling.</p>
              <p class="art-p">
                <span class="hl-green">By anchoring lightweight bookmark flags directly to vertical scroll offsets, readers construct an instant cognitive map of the document</span>, enabling effortless jump-backs without losing context.
              </p>
            </div>
            <div class="bubble">
              <span class="bubble-main">🔖 Add Margin</span>
              <div class="divider"></div>
              <div class="swatches">
                <div class="swatch" style="background:#ffd166" title="Gold"></div>
                <div class="swatch" style="background:#06d6a0; border-color:#fff; transform:scale(1.2)" title="Emerald"></div>
                <div class="swatch" style="background:#b5179e" title="Purple"></div>
                <div class="swatch" style="background:#00d4ff" title="Cyan"></div>
                <div class="swatch" style="background:#ff4d6d" title="Coral"></div>
              </div>
            </div>
            <div class="sf-marker-card">
              <div class="card-badge">🟢 31% · Key Insight</div>
              <div>"By anchoring lightweight bookmark flags directly to vertical scroll offsets..."</div>
            </div>
            <div class="sf-rail-wrap">
              <div class="sf-marker-dot" style="top:31%; background:#06d6a0; box-shadow:0 0 10px #06d6a0"></div>
              <div class="sf-marker-dot" style="top:58%; background:#ffd166; box-shadow:0 0 8px #ffd166"></div>
              <div class="sf-marker-dot" style="top:82%; background:#ff4d6d; box-shadow:0 0 8px #ff4d6d"></div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  },

  // 5. Screenshot 3: Auto-TOC & Quick Drawer (1280x800)
  {
    name: 'screenshot-3-auto-toc-drawer-1280x800.png',
    width: 1280,
    height: 800,
    renderHtml: () => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body {
            width: 1280px; height: 800px; overflow: hidden;
            background: #090b14;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans Arabic", sans-serif;
            color: #ffffff; display: flex; flex-direction: column;
          }
          .banner-header {
            padding: 30px 48px; background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%);
            display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          .headline-title { font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; }
          .headline-subtitle { font-size: 15px; color: #00d4ff; font-weight: 600; margin-top: 4px; }
          .badge-step {
            padding: 6px 14px; border-radius: 999px; background: rgba(0, 212, 255, 0.12);
            border: 1px solid rgba(0, 212, 255, 0.3); font-size: 13px; font-weight: 700; color: #00d4ff;
          }
          .browser-viewport {
            flex: 1; margin: 24px 48px 36px; border-radius: 16px;
            background: #0f1220; border: 1px solid rgba(255,255,255,0.12);
            box-shadow: 0 24px 60px rgba(0,0,0,0.6); display: flex; flex-direction: column; overflow: hidden; position: relative;
          }
          .browser-nav {
            height: 42px; background: #161a2e; border-bottom: 1px solid rgba(255,255,255,0.08);
            display: flex; align-items: center; padding: 0 16px; gap: 14px;
          }
          .nav-dots { display: flex; gap: 7px; }
          .nav-dot { width: 11px; height: 11px; border-radius: 50%; }
          .nav-url {
            flex: 1; max-width: 440px; height: 26px; border-radius: 6px; background: rgba(0,0,0,0.25);
            display: flex; align-items: center; padding: 0 12px; font-size: 12px; color: #94a3b8;
          }
          .browser-content {
            flex: 1; padding: 40px 100px; display: flex; justify-content: space-between; position: relative;
          }
          .article-text { max-width: 580px; }
          .art-h1 { font-size: 32px; font-weight: 800; margin-bottom: 16px; line-height: 1.3; color: #f1f5f9; }
          .art-p { font-size: 15px; line-height: 1.8; color: #94a3b8; margin-bottom: 20px; }
          .drawer {
            position: absolute; right: 54px; top: 40px; width: 280px;
            background: rgba(20, 24, 40, 0.95); border: 1px solid rgba(255,255,255,0.18);
            border-radius: 14px; box-shadow: 0 16px 40px rgba(0,0,0,0.6); backdrop-filter: blur(16px);
            overflow: hidden; display: flex; flex-direction: column;
          }
          .drawer-header {
            padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.08);
            display: flex; align-items: center; justify-content: space-between; font-size: 13px; font-weight: 700;
          }
          .drawer-tabs {
            display: flex; border-bottom: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02);
          }
          .tab { flex: 1; padding: 8px 10px; font-size: 11px; font-weight: 700; text-align: center; color: #94a3b8; cursor: pointer; }
          .tab.active { color: #00d4ff; border-bottom: 2px solid #00d4ff; background: rgba(0,212,255,0.06); }
          .toc-list { padding: 10px; display: flex; flex-direction: column; gap: 6px; }
          .toc-item {
            padding: 8px 10px; border-radius: 8px; background: rgba(255,255,255,0.04);
            display: flex; align-items: center; justify-content: space-between; font-size: 12px; font-weight: 600;
          }
          .toc-item:hover, .toc-item.active { background: rgba(0,212,255,0.12); border: 1px solid rgba(0,212,255,0.3); }
          .toc-pct { font-size: 10px; font-weight: 700; color: #00d4ff; background: rgba(0,212,255,0.15); padding: 2px 5px; border-radius: 4px; }
          .sf-rail-wrap {
            position: absolute; right: 28px; top: 40px; height: 420px; width: 10px;
            background: rgba(255,255,255,0.12); border-radius: 999px;
          }
          .toc-tick {
            position: absolute; left: 50%; transform: translate(-50%, -50%);
            width: 14px; height: 3px; border-radius: 2px; background: #ffffff;
            box-shadow: 0 0 6px rgba(255,255,255,0.8);
          }
        </style>
      </head>
      <body>
        <div class="banner-header">
          <div>
            <div class="headline-title">Auto-Generated Table of Contents & Navigation Drawer</div>
            <div class="headline-subtitle">توليد فهرس عناوين تلقائي على الشريط مع درج تنقل سريع بضغطة زر</div>
          </div>
          <div class="badge-step">03 / FEATURE SHOWCASE</div>
        </div>
        <div class="browser-viewport">
          <div class="browser-nav">
            <div class="nav-dots">
              <div class="nav-dot" style="background:#ff5f56"></div>
              <div class="nav-dot" style="background:#ffbd2e"></div>
              <div class="nav-dot" style="background:#27c93f"></div>
            </div>
            <div class="nav-url">🔒 https://example.com/guide-to-machine-learning</div>
          </div>
          <div class="browser-content">
            <div class="article-text">
              <h1 class="art-h1">The Definitive Guide to Distributed Machine Learning</h1>
              <p class="art-p">ScrollFlow automatically parses headings across long documents and generates proportional navigation ticks right on your scroll rail.</p>
              <p class="art-p">Open the Quick Index Drawer with one click to see all sections, navigate instantly, and retain complete control over lengthy articles.</p>
            </div>
            <div class="drawer">
              <div class="drawer-header">
                <span>📑 Headings & Bookmarks</span>
                <span style="font-size:11px; color:#94a3b8">✕</span>
              </div>
              <div class="drawer-tabs">
                <div class="tab">🔖 Bookmarks (4)</div>
                <div class="tab active">📑 Headings (5)</div>
              </div>
              <div class="toc-list">
                <div class="toc-item active">
                  <span>1. Introduction & Overview</span>
                  <span class="toc-pct">8%</span>
                </div>
                <div class="toc-item">
                  <span style="padding-left:8px">1.1 Model Parallelism</span>
                  <span class="toc-pct">24%</span>
                </div>
                <div class="toc-item">
                  <span style="padding-left:8px">1.2 Data Sharding</span>
                  <span class="toc-pct">46%</span>
                </div>
                <div class="toc-item">
                  <span>2. Benchmarking Results</span>
                  <span class="toc-pct">68%</span>
                </div>
                <div class="toc-item">
                  <span>3. Production Checklist</span>
                  <span class="toc-pct">89%</span>
                </div>
              </div>
            </div>
            <div class="sf-rail-wrap">
              <div class="toc-tick" style="top:8%"></div>
              <div class="toc-tick" style="top:24%"></div>
              <div class="toc-tick" style="top:46%"></div>
              <div class="toc-tick" style="top:68%"></div>
              <div class="toc-tick" style="top:89%"></div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  },

  // 6. Screenshot 4: 1-Click Markdown Export & Zen Mode (1280x800)
  {
    name: 'screenshot-4-export-zen-1280x800.png',
    width: 1280,
    height: 800,
    renderHtml: () => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body {
            width: 1280px; height: 800px; overflow: hidden;
            background: #090b14;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans Arabic", sans-serif;
            color: #ffffff; display: flex; flex-direction: column;
          }
          .banner-header {
            padding: 30px 48px; background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%);
            display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          .headline-title { font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; }
          .headline-subtitle { font-size: 15px; color: #06d6a0; font-weight: 600; margin-top: 4px; }
          .badge-step {
            padding: 6px 14px; border-radius: 999px; background: rgba(6, 214, 160, 0.12);
            border: 1px solid rgba(6, 214, 160, 0.3); font-size: 13px; font-weight: 700; color: #06d6a0;
          }
          .split-container {
            flex: 1; margin: 24px 48px 36px; display: flex; gap: 24px;
          }
          .card-box {
            flex: 1; border-radius: 16px; background: #0f1220; border: 1px solid rgba(255,255,255,0.12);
            padding: 28px 32px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); display: flex; flex-direction: column;
          }
          .box-title { font-size: 20px; font-weight: 800; margin-bottom: 8px; color: #ffffff; display: flex; align-items: center; gap: 8px; }
          .box-desc { font-size: 13px; line-height: 1.5; color: #94a3b8; margin-bottom: 20px; }
          .code-block {
            flex: 1; background: #070913; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
            padding: 16px; font-family: "JetBrains Mono", Consolas, monospace; font-size: 12px; line-height: 1.6;
            color: #d1d5db; overflow: hidden;
          }
          .code-header { color: #60a5fa; font-weight: bold; }
          .code-tag { color: #34d399; }
          .code-quote { color: #fde047; }
          .export-btn-demo {
            align-self: flex-start; margin-top: 16px; padding: 8px 16px; border-radius: 8px;
            background: rgba(6, 214, 160, 0.2); border: 1px solid #06d6a0; color: #ffffff;
            font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 6px;
          }
          .zen-visual {
            flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center;
            background: radial-gradient(circle at center, rgba(109,91,255,0.12) 0%, transparent 70%);
            border: 1px dashed rgba(255,255,255,0.18); border-radius: 12px; padding: 20px; text-align: center;
          }
          .zen-icon { font-size: 40px; margin-bottom: 12px; }
          .zen-pill {
            padding: 4px 12px; border-radius: 999px; background: rgba(255,255,255,0.1);
            font-size: 11px; font-weight: 700; color: #93c5fd; margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="banner-header">
          <div>
            <div class="headline-title">1-Click Notion/Markdown Export & Zen Auto-Hide Mode</div>
            <div class="headline-subtitle">تصدير فوري لكافة الهوامش لـ Notion وObsidian مع وضع القراءة الهادئ الخالي من أي مشتتات</div>
          </div>
          <div class="badge-step">04 / FEATURE SHOWCASE</div>
        </div>
        <div class="split-container">
          <div class="card-box">
            <div class="box-title">📋 1-Click Markdown Export</div>
            <div class="box-desc">Copy all your structured highlights, reading percentages, and categories formatted for Notion, Obsidian, or GitHub.</div>
            <div class="code-block">
              <div class="code-header"># [Research: System Architecture](https://example.com)</div>
              <div>> Exported via ScrollFlow (Bookmarks: 3)</div>
              <br>
              <div>- **[18%]** (<span class="code-tag">Important</span>) <span class="code-quote">"Zero-runtime dependency architecture ensures sub-20KB footprint."</span></div>
              <div>- **[42%]** (<span class="code-tag">Architecture</span>) <span class="code-quote">"Shadow DOM isolates styles from host CSS completely."</span></div>
              <div>- **[75%]** (<span class="code-tag">Takeaway</span>) <span class="code-quote">"Auto-pruning records after 90 days safeguards privacy."</span></div>
            </div>
            <div class="export-btn-demo">✓ Copied to Clipboard!</div>
          </div>
          <div class="card-box">
            <div class="box-title">🧘 Zen Mode (Distraction-Free)</div>
            <div class="box-desc">The progress rail gracefully fades out when you stop scrolling, giving you pure immersion. It instantly wakes up when you move.</div>
            <div class="zen-visual">
              <div class="zen-icon">✨</div>
              <div style="font-size:16px; font-weight:700">Seamless Idle Fade-Out</div>
              <div style="font-size:13px; color:#94a3b8; max-width:280px; margin-top:6px">Fades out after 2.5s of quiet reading. Zero clutter, 100% focus.</div>
              <div class="zen-pill">Auto Re-appears on Scroll or Hover</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  },

  // 7. Screenshot 5: Control Center & Bilingual RTL/LTR (1280x800)
  {
    name: 'screenshot-5-popup-bilingual-1280x800.png',
    width: 1280,
    height: 800,
    renderHtml: () => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body {
            width: 1280px; height: 800px; overflow: hidden;
            background: #090b14;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans Arabic", sans-serif;
            color: #ffffff; display: flex; flex-direction: column;
          }
          .banner-header {
            padding: 30px 48px; background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%);
            display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          .headline-title { font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; }
          .headline-subtitle { font-size: 15px; color: #b5179e; font-weight: 600; margin-top: 4px; }
          .badge-step {
            padding: 6px 14px; border-radius: 999px; background: rgba(181, 23, 158, 0.12);
            border: 1px solid rgba(181, 23, 158, 0.3); font-size: 13px; font-weight: 700; color: #ff6b9a;
          }
          .content-wrap {
            flex: 1; margin: 24px 48px 36px; display: flex; gap: 40px; align-items: center; justify-content: center;
          }
          .popup-card {
            width: 320px; background: rgba(18, 22, 38, 0.95); border: 1px solid rgba(255,255,255,0.18);
            border-radius: 18px; padding: 20px; box-shadow: 0 24px 60px rgba(0,0,0,0.6); backdrop-filter: blur(20px);
          }
          .popup-header {
            display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;
            padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          .p-title { font-size: 16px; font-weight: 800; color: #ffffff; }
          .lang-btn {
            padding: 3px 8px; border-radius: 6px; background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.15); font-size: 11px; font-weight: 700; color: #00d4ff;
          }
          .donut-row { display: flex; align-items: center; gap: 16px; margin-bottom: 18px; }
          .donut-circle {
            width: 64px; height: 64px; border-radius: 50%; border: 6px solid #6d5bff;
            display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 800;
            box-shadow: 0 0 16px rgba(109,91,255,0.5);
          }
          .p-row {
            display: flex; align-items: center; justify-content: space-between; padding: 8px 0;
            font-size: 12px; font-weight: 600; color: #cbd5e1; border-bottom: 1px solid rgba(255,255,255,0.04);
          }
          .switch-on {
            width: 34px; height: 20px; border-radius: 999px; background: #00d4ff; position: relative;
          }
          .switch-on::after {
            content:""; position: absolute; top: 2px; right: 2px; width: 16px; height: 16px;
            border-radius: 50%; background: #ffffff;
          }
          .switch-off {
            width: 34px; height: 20px; border-radius: 999px; background: rgba(255,255,255,0.2); position: relative;
          }
          .switch-off::after {
            content:""; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px;
            border-radius: 50%; background: #ffffff;
          }
          .info-col { max-width: 480px; }
          .info-h2 { font-size: 34px; font-weight: 800; line-height: 1.15; margin-bottom: 16px; color: #f8fafc; }
          .info-p { font-size: 16px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px; }
          .pill-group { display: flex; gap: 10px; flex-wrap: wrap; }
          .tag-pill {
            padding: 8px 14px; border-radius: 8px; background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.12); font-size: 13px; font-weight: 600; color: #e2e8f0;
          }
        </style>
      </head>
      <body>
        <div class="banner-header">
          <div>
            <div class="headline-title">Popup Control Center & Native Bilingual RTL/LTR</div>
            <div class="headline-subtitle">تحكم فوري ودقيق في كافة الإعدادات مع دعم كامل ومتقن للاتجاهين العربي والإنجليزي</div>
          </div>
          <div class="badge-step">05 / FEATURE SHOWCASE</div>
        </div>
        <div class="content-wrap">
          <div class="popup-card">
            <div class="popup-header">
              <span class="p-title">ScrollFlow</span>
              <span class="lang-btn">🌐 English</span>
            </div>
            <div class="donut-row">
              <div class="donut-circle">74%</div>
              <div>
                <div style="font-size:14px; font-weight:700">4.2 شاشات</div>
                <div style="font-size:11px; color:#94a3b8">وقت القراءة: 3 دقائق</div>
              </div>
            </div>
            <div class="p-row">
              <span>استعادة موضع التمرير</span>
              <div class="switch-on"></div>
            </div>
            <div class="p-row">
              <span>فهرس العناوين (TOC)</span>
              <div class="switch-on"></div>
            </div>
            <div class="p-row">
              <span>هوامش ونقاط الصفحة</span>
              <div class="switch-on"></div>
            </div>
            <div class="p-row">
              <span>وضع القراءة الهادئ (Zen)</span>
              <div class="switch-on"></div>
            </div>
            <div class="p-row">
              <span>إخفاء سكرول المتصفح</span>
              <div class="switch-on"></div>
            </div>
          </div>
          <div class="info-col">
            <h2 class="info-h2">Designed for Global Readers.<br>Bilingual by Default.</h2>
            <p class="info-p">ScrollFlow natively supports RTL (Arabic, Hebrew, Persian, Urdu) and LTR layout dynamics. Flip the interface language with a single click while maintaining full fidelity and aesthetic elegance.</p>
            <div class="pill-group">
              <div class="tag-pill">🌐 True RTL Layout Alignment</div>
              <div class="tag-pill">⚙️ Per-Site Toggle & Blocklist</div>
              <div class="tag-pill">🎨 6 Themes & Customizable Radii</div>
              <div class="tag-pill">🚀 0 Dependencies, 0 External Calls</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }
];

async function run() {
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: false,
    args: ['--headless=new', '--no-sandbox'],
  });

  const page = await browser.newPage();

  for (const asset of assets) {
    const filePath = path.join(outDir, asset.name);
    console.log(`Generating ${asset.name} (${asset.width}x${asset.height})...`);

    await page.setViewportSize({ width: asset.width, height: asset.height });
    await page.setContent(asset.renderHtml());

    // Allow fonts and gradients to settle
    await page.waitForTimeout(200);

    await page.screenshot({
      path: filePath,
      type: 'png',
    });

    console.log(`✓ Saved ${asset.name}`);
  }

  await browser.close();
  console.log('\nAll promotional store assets successfully generated in store-assets/');
}

run().catch((err) => {
  console.error('Error generating store assets:', err);
  process.exit(1);
});

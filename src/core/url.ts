// src/core/url.ts — URL normalization and exclusion logic (FR-17, FR-27, FR-28, PRD §10.3)
import type { Settings } from '../shared/types';

const TRACKING_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  'gclid',
  'ref',
  'source',
  'mc_cid',
  'mc_eid',
  'igshid',
]);

const INTERNAL_SCHEMES = ['chrome:', 'chrome-extension:', 'about:', 'edge:', 'view-source:'];

export function normalizeUrl(raw: string): string {
  try {
    const u = new URL(raw);

    // Filter tracking query parameters
    const searchParams = new URLSearchParams(u.search);
    for (const key of Array.from(searchParams.keys())) {
      if (TRACKING_PARAMS.has(key.toLowerCase()) || key.toLowerCase().startsWith('utm_')) {
        searchParams.delete(key);
      }
    }
    const cleanSearch = searchParams.toString();
    const searchStr = cleanSearch ? `?${cleanSearch}` : '';

    // Handle hash: preserve SPA hash-routing (#/...)
    let hashStr = '';
    if (u.hash.startsWith('#/')) {
      hashStr = u.hash;
    }

    // Strip trailing slash on pathname except root '/'
    let pathname = u.pathname;
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }

    return `${u.origin}${pathname}${searchStr}${hashStr}`;
  } catch {
    return raw;
  }
}

export function matchesHostPattern(pattern: string, hostname: string): boolean {
  const normHost = hostname.toLowerCase();
  const normPattern = pattern.toLowerCase();

  if (normPattern.startsWith('*.')) {
    const suffix = normPattern.slice(2);
    return normHost.endsWith(`.${suffix}`) && normHost !== suffix;
  }

  // Bare pattern: matches exact domain, www.domain, or any subdomain
  if (normHost === normPattern) return true;
  if (normHost.endsWith(`.${normPattern}`)) return true;

  return false;
}

export function isExcluded(
  url: string,
  settings: Pick<Settings, 'blocklist' | 'allowFileUrls'>
): boolean {
  if (!url) return true;

  try {
    const u = new URL(url);

    // Check internal browser schemes
    if (INTERNAL_SCHEMES.some((scheme) => u.protocol === scheme || url.startsWith(scheme))) {
      return true;
    }

    // Check Chrome Web Store
    if (
      u.hostname === 'chromewebstore.google.com' ||
      (u.hostname === 'chrome.google.com' && u.pathname.startsWith('/webstore'))
    ) {
      return true;
    }

    // Check file:// URLs
    if (u.protocol === 'file:') {
      return !settings.allowFileUrls;
    }

    // Check blocklist (ignoring leading www. from hostname for comparison)
    const hostWithoutWww = u.hostname.startsWith('www.') ? u.hostname.slice(4) : u.hostname;
    for (const pattern of settings.blocklist) {
      if (matchesHostPattern(pattern, u.hostname) || matchesHostPattern(pattern, hostWithoutWww)) {
        return true;
      }
    }

    return false;
  } catch {
    // If not a valid URL or special scheme, exclude by default
    return true;
  }
}

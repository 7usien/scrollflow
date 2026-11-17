// src/core/export.ts — Pure export engine for bookmarks (Markdown & Plain text)
import type { BookmarkEntry } from '../shared/types';
import { sortBookmarks, BOOKMARK_COLORS } from './bookmarks';

export interface ExportOptions {
  pageTitle: string;
  url: string;
  bookmarks: BookmarkEntry[];
  locale?: 'ar' | 'en';
}

/**
 * Formats bookmarks as clean, structured Markdown ready for Notion, Obsidian, GitHub, etc.
 */
export function formatBookmarksAsMarkdown(options: ExportOptions): string {
  const { pageTitle, url, bookmarks, locale = 'ar' } = options;
  const isAr = locale === 'ar';
  const sorted = sortBookmarks(bookmarks);

  const headerTitle = pageTitle ? `[${pageTitle}](${url})` : url;
  const countStr = isAr ? `عدد الهوامش: ${sorted.length}` : `Bookmarks: ${sorted.length}`;
  const exportedBy = isAr ? 'تم تصدير الهوامش بواسطة ScrollFlow' : 'Exported via ScrollFlow';

  const lines: string[] = [
    `# ${headerTitle}`,
    `> ${exportedBy} (${countStr})`,
    '',
    isAr ? '---' : '---',
  ];

  if (sorted.length === 0) {
    lines.push(isAr ? '*لا توجد هوامش محفوظة.*' : '*No bookmarks saved.*');
    return lines.join('\n');
  }

  for (const b of sorted) {
    const pct = Math.round(b.scrollRatio * 100);
    const colorInfo = b.color ? BOOKMARK_COLORS[b.color] : BOOKMARK_COLORS.blue;
    const tag = isAr ? colorInfo.labelAr : colorInfo.labelEn;

    lines.push(`- **[${pct}%]** (${tag}) "${b.text}"`);
  }

  lines.push('');
  return lines.join('\n');
}

/**
 * Formats bookmarks as simple plain text for quick copying.
 */
export function formatBookmarksAsText(options: ExportOptions): string {
  const { pageTitle, url, bookmarks } = options;
  const sorted = sortBookmarks(bookmarks);

  const lines: string[] = [
    pageTitle ? `${pageTitle} (${url})` : url,
    `----------------------------------------`,
  ];

  for (const b of sorted) {
    const pct = Math.round(b.scrollRatio * 100);
    lines.push(`[${pct}%] ${b.text}`);
  }

  return lines.join('\n');
}

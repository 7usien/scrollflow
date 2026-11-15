// contracts/messages.ts — عقد الرسائل. يُنسخ إلى src/shared/messages.ts
import type { Metrics, ScrollEntry, Settings } from './types';

export const MSG = {
  PROGRESS_UPDATE: 'PROGRESS_UPDATE',
  GET_TAB_STATE: 'GET_TAB_STATE',
  SETTINGS_GET: 'SETTINGS_GET',
  SETTINGS_PATCH: 'SETTINGS_PATCH',
  SETTINGS_CHANGED: 'SETTINGS_CHANGED',
  SITE_TOGGLE: 'SITE_TOGGLE',
  SAVE_POSITION: 'SAVE_POSITION',
  GET_POSITION: 'GET_POSITION',
  CLEAR_POSITIONS: 'CLEAR_POSITIONS',
  NAV_CHANGED: 'NAV_CHANGED',
  TOGGLE_OVERLAY: 'TOGGLE_OVERLAY',
} as const;

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export interface Req {
  [MSG.PROGRESS_UPDATE]: { url: string; percent: number; scrollable: boolean; metrics: Metrics };
  [MSG.GET_TAB_STATE]: { tabId: number };
  [MSG.SETTINGS_GET]: Record<string, never>;
  [MSG.SETTINGS_PATCH]: { patch: Partial<Settings> };
  [MSG.SETTINGS_CHANGED]: Settings;
  [MSG.SITE_TOGGLE]: { hostname: string; enabled: boolean };
  [MSG.SAVE_POSITION]: ScrollEntry;
  [MSG.GET_POSITION]: { url: string };
  [MSG.CLEAR_POSITIONS]: Record<string, never>;
  [MSG.NAV_CHANGED]: { url: string };
  [MSG.TOGGLE_OVERLAY]: Record<string, never>;
}

export interface Res {
  [MSG.PROGRESS_UPDATE]: Result<null>;
  [MSG.GET_TAB_STATE]: Result<{ percent: number; metrics: Metrics | null; siteEnabled: boolean; settings: Settings }>;
  [MSG.SETTINGS_GET]: Result<Settings>;
  [MSG.SETTINGS_PATCH]: Result<Settings>;
  [MSG.SETTINGS_CHANGED]: never;
  [MSG.SITE_TOGGLE]: Result<Settings>;
  [MSG.SAVE_POSITION]: Result<null>;
  [MSG.GET_POSITION]: Result<ScrollEntry | null>;
  [MSG.CLEAR_POSITIONS]: Result<{ cleared: number }>;
  [MSG.NAV_CHANGED]: never;
  [MSG.TOGGLE_OVERLAY]: never;
}

export type MsgType = keyof Req;

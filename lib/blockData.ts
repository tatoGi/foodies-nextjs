import {cmsAsset} from '@/lib/cms';

/** One CMS page block's data. Every reader falls back to today's site content when a field is empty. */
export type BlockData = Record<string, unknown>;

export function text(data: BlockData | undefined, key: string, fallback: string): string {
  const value = data?.[key];
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : fallback;
}

export function image(data: BlockData | undefined, key: string, fallback: string): string {
  return cmsAsset(data?.[key]) ?? fallback;
}

export function images(data: BlockData | undefined, key: string, fallback: string[]): string[] {
  const raw = data?.[key];
  const list = Array.isArray(raw) ? raw.map((item) => cmsAsset(item)).filter((item): item is string => Boolean(item)) : [];
  return list.length > 0 ? list : fallback;
}

/** Reads one text field from each repeater row, e.g. list_one: [{text: '…'}]. */
export function textList(data: BlockData | undefined, key: string, field: string, fallback: string[]): string[] {
  const raw = data?.[key];
  const list = Array.isArray(raw)
    ? raw.map((row) => (row && typeof row === 'object' ? text(row as BlockData, field, '') : '')).filter(Boolean)
    : [];
  return list.length > 0 ? list : fallback;
}

export function lines(value: string): string[] {
  return value.split('\n').map((line) => line.trim()).filter(Boolean);
}

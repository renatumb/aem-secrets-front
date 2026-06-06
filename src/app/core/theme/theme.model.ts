/** Theme ids must match `data-theme` values in styles.css */
export type ThemeId = 'light' | 'dark' | 'middle';

export const THEME_IDS: readonly ThemeId[] = ['light', 'dark', 'middle'] as const;

export const DEFAULT_THEME: ThemeId = 'light';

export const THEME_STORAGE_KEY = 'aemsecrets-theme';

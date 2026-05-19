import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {
  DEFAULT_THEME,
  THEME_IDS,
  THEME_STORAGE_KEY,
  ThemeId,
} from './theme.model';

@Injectable({providedIn: 'root'})
export class ThemeService {
  private readonly themeSubject = new BehaviorSubject<ThemeId>(DEFAULT_THEME);

  /** Current theme; emits on every change (including init). */
  readonly theme$: Observable<ThemeId> = this.themeSubject.asObservable();

  /**
   * Restores persisted theme (or default), applies it to the document, and syncs subscribers.
   * Safe to call multiple times (e.g. APP_INITIALIZER + AppComponent).
   */
  initTheme(): void {
    const stored = this.readStoredTheme();
    const theme = stored ?? DEFAULT_THEME;
    this.applyTheme(theme, false);
    this.themeSubject.next(theme);
  }

  getTheme(): ThemeId {
    return this.themeSubject.value;
  }

  setTheme(theme: ThemeId): void {
    if (!this.isValidTheme(theme)) {
      return;
    }
    this.applyTheme(theme, true);
    this.themeSubject.next(theme);
  }

  private readStoredTheme(): ThemeId | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    try {
      const raw = localStorage.getItem(THEME_STORAGE_KEY);
      return raw && this.isValidTheme(raw) ? raw : null;
    } catch {
      return null;
    }
  }

  private applyTheme(theme: ThemeId, persist: boolean): void {
    const body = document.body;
    if (!body) {
      return;
    }
    body.setAttribute('data-theme', theme);
    if (persist) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch (e) {
        console.error('Error while setting theme: ', theme);
        console.error(e);
      }
    }
  }

  private isValidTheme(value: string): value is ThemeId {
    return (THEME_IDS as readonly string[]).includes(value);
  }
}

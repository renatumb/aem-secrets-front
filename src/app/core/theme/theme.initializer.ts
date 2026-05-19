import { ThemeService } from './theme.service';

/** Runs before bootstrap so persisted theme is applied as early as possible. */
export function themeInitializer(themeService: ThemeService): () => void {
  return () =>  themeService.initTheme();
}

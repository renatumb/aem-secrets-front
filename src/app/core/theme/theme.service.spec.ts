import { TestBed } from '@angular/core/testing';
import { DEFAULT_THEME, THEME_STORAGE_KEY, ThemeId } from './theme.model';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.body.setAttribute('data-theme', DEFAULT_THEME);
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
    document.body.setAttribute('data-theme', DEFAULT_THEME);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('initTheme should apply default when storage is empty', () => {
    service.initTheme();
    expect(service.getTheme()).toBe(DEFAULT_THEME);
    expect(document.body.getAttribute('data-theme')).toBe(DEFAULT_THEME);
  });

  it('initTheme should restore persisted theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    service.initTheme();
    expect(service.getTheme()).toBe('dark');
    expect(document.body.getAttribute('data-theme')).toBe('dark');
  });

  it('setTheme should persist and update document', () => {
    service.setTheme('middle');
    expect(service.getTheme()).toBe('middle');
    expect(document.body.getAttribute('data-theme')).toBe('middle');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('middle');
  });

  it('setTheme should ignore invalid theme ids', () => {
    service.setTheme('light');
    service.setTheme('invalid' as ThemeId);
    expect(service.getTheme()).toBe('light');
  });

  it('theme$ should emit on setTheme', (done) => {
    const values: ThemeId[] = [];
    service.theme$.subscribe((theme) => {
      values.push(theme);
      if (values.length === 2) {
        expect(values[1]).toBe('dark');
        done();
      }
    });
    service.setTheme('dark');
  });
});

import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ThemeService } from './core/theme/theme.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([])
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'AEM Secrets'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('AEM Secrets');
  });

  it('should initialize theme on init', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const themeService = TestBed.inject(ThemeService);
    spyOn(themeService, 'initTheme');
    fixture.detectChanges();
    expect(themeService.initTheme).toHaveBeenCalled();
  });
});

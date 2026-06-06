import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponentComponent } from './header-component.component';
import { ThemeService } from '../../core/theme/theme.service';

describe('HeaderComponentComponent', () => {
  let component: HeaderComponentComponent;
  let fixture: ComponentFixture<HeaderComponentComponent>;
  let themeService: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponentComponent],
    }).compileComponents();

    themeService = TestBed.inject(ThemeService);
    spyOn(themeService, 'setTheme');

    fixture = TestBed.createComponent(HeaderComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('switchTheme should delegate to ThemeService', () => {
    component.switchTheme('dark');
    expect(themeService.setTheme).toHaveBeenCalledWith('dark');
  });
});

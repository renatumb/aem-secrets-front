import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponentComponent } from './footer-component.component';

describe('FooterComponentComponent', () => {
  let component: FooterComponentComponent;
  let fixture: ComponentFixture<FooterComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the current copyright year', () => {
    const year = new Date().getFullYear();
    expect(component.copyrightYear).toBe(year);
    expect(fixture.nativeElement.textContent).toContain(`Copyright © ${year} AEM Secrets`);
  });
});


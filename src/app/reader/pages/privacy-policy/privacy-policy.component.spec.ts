import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicyComponent } from './privacy-policy.component';

describe('PrivacyPolicyComponent', () => {
  let component: PrivacyPolicyComponent;
  let fixture: ComponentFixture<PrivacyPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrivacyPolicyComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mention newsletter, unsubscribe, and reCAPTCHA (no analytics claims)', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Privacy Policy');
    expect(text).toContain('unsubscribe');
    expect(text).toContain('reCAPTCHA');
    expect(text).toContain('We do not use Google Analytics');
    expect(text).not.toContain('cookie banner');
  });
});

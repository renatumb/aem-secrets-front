import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ContactUsComponent } from './contact-us.component';
import { ContactService } from '../../services/contact.service';

describe('ContactUsComponent', () => {
  let component: ContactUsComponent;
  let fixture: ComponentFixture<ContactUsComponent>;
  let contactService: jasmine.SpyObj<ContactService>;

  beforeEach(async () => {
    contactService = jasmine.createSpyObj('ContactService', ['send']);

    await TestBed.configureTestingModule({
      declarations: [ContactUsComponent],
      imports: [FormsModule],
      providers: [{ provide: ContactService, useValue: contactService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send the contact payload after verification', fakeAsync(() => {
    contactService.send.and.returnValue(of(undefined));
    component.name = 'Ada';
    component.email = 'ada@example.com';
    component.message = 'Hello';
    component.challengeAnswer = String(component.challengeA + component.challengeB);

    tick(3000);
    component.onSubmit();

    expect(contactService.send).toHaveBeenCalledWith({
      name: 'Ada',
      email: 'ada@example.com',
      message: 'Hello',
    });
    expect(component.successMessage).toContain('Thanks');
  }));

  it('should not call the API when the honeypot is filled', fakeAsync(() => {
    component.name = 'Bot';
    component.email = 'bot@example.com';
    component.message = 'Spam';
    component.company = 'Acme Corp';
    component.challengeAnswer = String(component.challengeA + component.challengeB);

    tick(3000);
    component.onSubmit();

    expect(contactService.send).not.toHaveBeenCalled();
    expect(component.successMessage).toBeTruthy();
  }));

  it('should reject an incorrect challenge answer', fakeAsync(() => {
    component.name = 'Ada';
    component.email = 'ada@example.com';
    component.message = 'Hello';
    component.challengeAnswer = String(component.challengeA + component.challengeB + 1);

    tick(3000);
    component.onSubmit();

    expect(contactService.send).not.toHaveBeenCalled();
    expect(component.error).toContain('verification');
  }));

  it('should show an error when the API fails', fakeAsync(() => {
    contactService.send.and.returnValue(throwError(() => new Error('fail')));
    component.name = 'Ada';
    component.email = 'ada@example.com';
    component.message = 'Hello';
    component.challengeAnswer = String(component.challengeA + component.challengeB);

    tick(3000);
    component.onSubmit();

    expect(component.error).toContain('Could not send');
  }));
});

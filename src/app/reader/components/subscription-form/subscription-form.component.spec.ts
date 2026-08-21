import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { SubscriptionFormComponent } from './subscription-form.component';
import { SubscribersService } from '../../services/subscribers.service';
import { RecaptchaService } from '../../../shared/security/recaptcha.service';
import { RecaptchaUnavailableError } from '../../../shared/security/recaptcha.model';

describe('SubscriptionFormComponent', () => {
  let component: SubscriptionFormComponent;
  let fixture: ComponentFixture<SubscriptionFormComponent>;
  let subscribersService: jasmine.SpyObj<SubscribersService>;
  let recaptcha: jasmine.SpyObj<RecaptchaService>;

  beforeEach(async () => {
    subscribersService = jasmine.createSpyObj('SubscribersService', ['create']);
    subscribersService.create.and.returnValue(of({ name: 'Ada', email: 'ada@example.com' } as any));
    recaptcha = jasmine.createSpyObj('RecaptchaService', ['execute']);
    recaptcha.execute.and.returnValue(of('test-token'));

    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [SubscriptionFormComponent],
      providers: [
        { provide: SubscribersService, useValue: subscribersService },
        { provide: RecaptchaService, useValue: recaptcha },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should require consent before subscribing', () => {
    component.email = 'ada@example.com';
    component.name = 'Ada';
    component.consented = false;

    component.submit();

    expect(recaptcha.execute).not.toHaveBeenCalled();
    expect(subscribersService.create).not.toHaveBeenCalled();
  });

  it('should subscribe when consent is given', () => {
    component.email = 'ada@example.com';
    component.name = 'Ada';
    component.consented = true;

    component.submit();

    expect(recaptcha.execute).toHaveBeenCalledWith('subscribe');
    expect(subscribersService.create).toHaveBeenCalledWith(
      {
        email: 'ada@example.com',
        name: 'Ada',
      },
      'test-token',
    );
    expect(component.successMessage).toContain('unsubscribe');
  });

  it('should show a verification error when reCAPTCHA fails', () => {
    recaptcha.execute.and.returnValue(throwError(() => new RecaptchaUnavailableError()));
    component.email = 'ada@example.com';
    component.name = 'Ada';
    component.consented = true;

    component.submit();

    expect(subscribersService.create).not.toHaveBeenCalled();
    expect(component.error).toContain('verify');
  });
});

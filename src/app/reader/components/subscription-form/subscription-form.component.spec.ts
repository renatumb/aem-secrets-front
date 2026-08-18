import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SubscriptionFormComponent } from './subscription-form.component';
import { SubscribersService } from '../../services/subscribers.service';

describe('SubscriptionFormComponent', () => {
  let component: SubscriptionFormComponent;
  let fixture: ComponentFixture<SubscriptionFormComponent>;
  let subscribersService: jasmine.SpyObj<SubscribersService>;

  beforeEach(async () => {
    subscribersService = jasmine.createSpyObj('SubscribersService', ['create']);
    subscribersService.create.and.returnValue(of({ name: 'Ada', email: 'ada@example.com' } as any));

    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [SubscriptionFormComponent],
      providers: [{ provide: SubscribersService, useValue: subscribersService }],
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

    expect(subscribersService.create).not.toHaveBeenCalled();
  });

  it('should subscribe when consent is given', () => {
    component.email = 'ada@example.com';
    component.name = 'Ada';
    component.consented = true;

    component.submit();

    expect(subscribersService.create).toHaveBeenCalledWith({
      email: 'ada@example.com',
      name: 'Ada',
    });
    expect(component.successMessage).toContain('unsubscribe');
  });
});

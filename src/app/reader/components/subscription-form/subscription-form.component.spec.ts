import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { SubscriptionFormComponent } from './subscription-form.component';
import { SubscribersService } from '../../services/subscribers.service';

describe('SubscriptionFormComponent', () => {
  let component: SubscriptionFormComponent;
  let fixture: ComponentFixture<SubscriptionFormComponent>;

  beforeEach(async () => {
    const serviceStub: Partial<SubscribersService> = {
      create: () => of({} as any),
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [SubscriptionFormComponent],
      providers: [{ provide: SubscribersService, useValue: serviceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

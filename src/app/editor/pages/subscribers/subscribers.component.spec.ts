import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SubscribersComponent } from './subscribers.component';
import { SubscribersService } from '../../services/subscribers.service';

describe('SubscribersComponent', () => {
  let component: SubscribersComponent;
  let fixture: ComponentFixture<SubscribersComponent>;

  beforeEach(async () => {
    const serviceStub: Partial<SubscribersService> = {
      list: () => of({ content: [] }),
      switchActive: () => of({} as any),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule],
      declarations: [SubscribersComponent],
      providers: [{ provide: SubscribersService, useValue: serviceStub }],
      schemas: [],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscribersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

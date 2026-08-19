import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SubscribersComponent } from './subscribers.component';
import { SubscribersService } from '../../services/subscribers.service';
import { StatusChangeSource } from '../../../shared/models/subscriber.model';

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
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscribersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map status change sources to icons and labels', () => {
    expect(component.statusChangeSourceIcon(StatusChangeSource.SUBSCRIBE)).toBe('matPersonAddRound');
    expect(component.statusChangeSourceLabel(StatusChangeSource.UNSUBSCRIBE_LINK)).toBe('Unsubscribed via email link');
    expect(component.statusChangeSourceIcon(StatusChangeSource.EDITOR_PATCH)).toBe('matEditRound');
  });
});

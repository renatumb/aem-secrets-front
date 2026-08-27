import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';

import { UnsubscribeComponent } from './unsubscribe.component';
import { SubscribersService } from '../../services/subscribers.service';

describe('UnsubscribeComponent', () => {
  let component: UnsubscribeComponent;
  let fixture: ComponentFixture<UnsubscribeComponent>;
  let subscribersService: jasmine.SpyObj<SubscribersService>;
  let queryParams$: Subject<ReturnType<typeof convertToParamMap>>;

  beforeEach(async () => {
    queryParams$ = new Subject();
    subscribersService = jasmine.createSpyObj('SubscribersService', ['unsubscribeByToken']);

    await TestBed.configureTestingModule({
      declarations: [UnsubscribeComponent],
      providers: [
        { provide: SubscribersService, useValue: subscribersService },
        {
          provide: ActivatedRoute,
          useValue: { queryParamMap: queryParams$.asObservable() },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UnsubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show missing-token guidance when no token is provided', () => {
    queryParams$.next(convertToParamMap({}));

    expect(component.status).toBe('missing-token');
  });

  it('should unsubscribe automatically when a token is present', () => {
    subscribersService.unsubscribeByToken.and.returnValue(of(undefined));

    queryParams$.next(convertToParamMap({ token: 'abc123' }));

    expect(subscribersService.unsubscribeByToken).toHaveBeenCalledWith('abc123');
    expect(component.status).toBe('success');
  });

  it('should show an error when unsubscribe fails', () => {
    subscribersService.unsubscribeByToken.and.returnValue(throwError(() => new Error('fail')));

    queryParams$.next(convertToParamMap({ token: 'bad-token' }));

    expect(component.status).toBe('error');
  });
});

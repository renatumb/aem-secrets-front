import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['login', 'isAuthenticated']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    authService.isAuthenticated.and.returnValue(false);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [CommonModule, FormsModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigates to dashboard on successful login', () => {
    authService.login.and.returnValue(of({ token: 'jwt-token' }));
    component.email = 'write@mail.com';
    component.password = 'pass1234';

    component.onSubmit(new Event('submit'));

    expect(authService.login).toHaveBeenCalledWith('write@mail.com', 'pass1234');
    expect(router.navigate).toHaveBeenCalledWith(['/editor/dashboard']);
    expect(component.error).toBeNull();
  });

  it('shows a safe error message on login failure', () => {
    authService.login.and.returnValue(throwError(() => ({ status: 401 })));
    component.email = 'write@mail.com';
    component.password = 'wrong';

    component.onSubmit(new Event('submit'));

    expect(component.error).toBe('Could not log in. Check your credentials and try again.');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});

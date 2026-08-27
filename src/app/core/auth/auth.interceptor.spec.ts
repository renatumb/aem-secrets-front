import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { withAuth } from './auth.context';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getToken', 'clearToken']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('adds Bearer token when AUTH_REQUIRED and token exist', () => {
    authService.getToken.and.returnValue('test-token');

    http.get('/api/post', withAuth()).subscribe();

    const req = httpMock.expectOne('/api/post');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush([]);
  });

  it('does not add Authorization for unmarked requests even when token exists', () => {
    authService.getToken.and.returnValue('test-token');

    http.get('/api/post').subscribe();

    const req = httpMock.expectOne('/api/post');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush([]);
  });

  it('clears token and redirects on 401 for auth-required requests', () => {
    authService.getToken.and.returnValue('test-token');

    http.get('/api/post', withAuth()).subscribe({
      error: (err: HttpErrorResponse) => {
        expect(err.status).toBe(401);
      },
    });

    const req = httpMock.expectOne('/api/post');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(authService.clearToken).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/editor']);
  });
});

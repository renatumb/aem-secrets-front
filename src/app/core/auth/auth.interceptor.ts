import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { AUTH_REQUIRED } from './auth.context';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const  authRequired = req.context.get(AUTH_REQUIRED);
    let request = req;

    if (authRequired) {
      const token = this.authService.getToken();
      if (token) {
        request = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
      }
    }

    return next.handle(request).pipe(
      catchError((err: unknown) => {
        if (
          authRequired &&
          err instanceof HttpErrorResponse &&
          err.status === 401
        ) {
          this.authService.clearToken();
          void this.router.navigate(['/editor']);
        }
        return throwError(() => err);
      }),
    );
  }
}

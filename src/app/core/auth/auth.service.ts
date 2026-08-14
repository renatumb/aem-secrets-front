import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { EDITOR_API_BASE_URL } from '../../shared/http/api.config';
import { AUTH_ENDPOINTS } from '../../shared/http/auth-endpoints';
import { LoginRequest, LoginResponse } from '../../shared/models/auth.model';

export const AUTH_TOKEN_KEY = 'aem_blog_auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    @Inject(EDITOR_API_BASE_URL) private readonly baseUrl: string,
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  login(username: string, password: string): Observable<LoginResponse> {
    const payload: LoginRequest = { username, password };

    return this.http
      .post<LoginResponse>(this.url(AUTH_ENDPOINTS.login()), payload)
      .pipe(
        tap((response) => {
          if (response?.token) {
            this.setToken(response.token);
          }
        }),
      );
  }

  logout(): void {
    this.clearToken();
    void this.router.navigate(['/editor']);
  }

  getToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && token.trim().length > 0;
  }

  clearToken(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  private setToken(token: string): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}

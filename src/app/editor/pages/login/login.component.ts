import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { toUserMessage } from '../../../shared/http/user-facing-error';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/editor/dashboard']);
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    const username = this.email.trim();
    const password = this.password;

    if (!username || !password) {
      this.error = 'Email and password are required.';
      return;
    }

    if (this.loading) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.authService
      .login(username, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          void this.router.navigate(['/editor/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.error = toUserMessage(err, 'Could not log in. Check your credentials and try again.');
          console.error('Login failed', err);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

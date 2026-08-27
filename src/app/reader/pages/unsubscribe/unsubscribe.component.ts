import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {SubscribersService} from '../../services/subscribers.service';

type UnsubscribeStatus = 'missing-token' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrl: './unsubscribe.component.css',
})
export class UnsubscribeComponent implements OnInit, OnDestroy {
  status: UnsubscribeStatus = 'loading';
  message: string | null = null;

  private token: string | null = null;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly subscribersService: SubscribersService,
  ) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe((params) => {
      this.token = params.get('token')?.trim() ?? null;

      if (!this.token) {
        this.status = 'missing-token';
        this.message = null;
        return;
      }

      this.runUnsubscribe();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  retry(): void {
    if (!this.token || this.status === 'loading') {
      return;
    }

    this.runUnsubscribe();
  }

  private runUnsubscribe(): void {
    if (!this.token) {
      return;
    }

    this.status = 'loading';
    this.message = null;

    this.subscribersService
      .unsubscribeByToken(this.token)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.status = 'success';
          this.message = 'You have been unsubscribed. You will no longer receive newsletter emails from AEM Secrets.';
        },
        error: (err) => {
          this.status = 'error';
          this.message = 'This unsubscribe link is invalid or has expired. Please contact us if you still receive emails.';
          console.error('Unsubscribe failed', err);
        },
      });
  }
}

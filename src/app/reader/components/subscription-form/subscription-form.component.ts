import { Component, OnDestroy } from '@angular/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { SubscribersService } from '../../services/subscribers.service';
import {
  RECAPTCHA_USER_MESSAGE,
  RecaptchaUnavailableError,
} from '../../../shared/security/recaptcha.model';
import { RecaptchaService } from '../../../shared/security/recaptcha.service';

@Component({
  selector: 'app-subscription-form',
  templateUrl: './subscription-form.component.html',
  styleUrl: './subscription-form.component.css'
})
export class SubscriptionFormComponent implements OnDestroy {
  email = '';
  name = '';
  consented = false;

  submitting = false;
  /** Confirmation message after a successful subscription. */
  successMessage: string | null = null;
  error: string | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly subscribersService: SubscribersService,
    private readonly recaptcha: RecaptchaService,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit(): void {
    const email = this.email.trim();
    const name = this.name.trim();
    if (!email || !name || !this.consented || this.submitting) {
      return;
    }

    this.submitting = true;
    this.error = null;
    this.successMessage = null;

    this.recaptcha
      .execute('subscribe')
      .pipe(
        switchMap((token) => this.subscribersService.create({ email, name }, token)),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (created) => {
          this.submitting = false;
          this.successMessage = `Thanks, ${created?.name ?? name}! You're subscribed. Use the unsubscribe link in any email to opt out.`;
          this.email = '';
          this.name = '';
          this.consented = false;
        },
        error: (err) => {
          this.submitting = false;
          this.error = err instanceof RecaptchaUnavailableError
            ? RECAPTCHA_USER_MESSAGE
            : 'Could not subscribe. Please try again.';
          console.error('Subscription failed', err);
        },
      });
  }
}

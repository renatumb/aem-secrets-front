import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { ContactService } from '../../services/contact.service';
import {
  RECAPTCHA_USER_MESSAGE,
  RecaptchaUnavailableError,
} from '../../../shared/security/recaptcha.model';
import { RecaptchaService } from '../../../shared/security/recaptcha.service';

/** Reject submissions faster than this (bot / script timing). */
const MIN_DWELL_MS = 3000;

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css',
})
export class ContactUsComponent implements OnInit, OnDestroy {
  name = '';
  email = '';
  message = '';

  /**
   * Honeypot: hidden from humans (CSS + tabindex). Bots that fill every field
   * trip this and the request is never sent.
   */
  company = '';

  submitting = false;
  successMessage: string | null = null;
  error: string | null = null;

  private formOpenedAt = 0;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly contactService: ContactService,
    private readonly recaptcha: RecaptchaService,
  ) {}

  ngOnInit(): void {
    this.formOpenedAt = Date.now();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    const name = this.name.trim();
    const email = this.email.trim();
    const message = this.message.trim();

    if (!name || !email || !message || this.submitting) {
      return;
    }

    if (this.company.trim() !== '') {
      // Silent success for bots that fill the honeypot — do not call the API.
      this.successMessage = 'Thanks! Your message was sent.';
      this.clearFields();
      return;
    }

    if (Date.now() - this.formOpenedAt < MIN_DWELL_MS) {
      this.error = 'Please take a moment to review your message, then try again.';
      return;
    }

    this.submitting = true;
    this.error = null;
    this.successMessage = null;

    this.recaptcha
      .execute('contact')
      .pipe(
        switchMap((token) => this.contactService.send({ name, email, message }, token)),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: () => {
          this.submitting = false;
          this.successMessage = 'Thanks! Your message was sent. We will get back to you soon.';
          this.clearFields();
          this.formOpenedAt = Date.now();
        },
        error: (err) => {
          this.submitting = false;
          this.error = err instanceof RecaptchaUnavailableError
            ? RECAPTCHA_USER_MESSAGE
            : 'Could not send your message. Please try again.';
          console.error('Contact submission failed', err);
        },
      });
  }

  private clearFields(): void {
    this.name = '';
    this.email = '';
    this.message = '';
    this.company = '';
  }
}

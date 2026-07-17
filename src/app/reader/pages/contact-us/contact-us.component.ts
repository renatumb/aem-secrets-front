import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ContactService } from '../../services/contact.service';

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

  challengeA = 0;
  challengeB = 0;
  challengeAnswer = '';

  submitting = false;
  successMessage: string | null = null;
  error: string | null = null;

  private formOpenedAt = 0;
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly contactService: ContactService) {}

  ngOnInit(): void {
    this.resetChallenge();
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

    const expected = this.challengeA + this.challengeB;
    const answered = Number.parseInt(this.challengeAnswer.trim(), 10);
    if (!Number.isFinite(answered) || answered !== expected) {
      this.error = 'Please solve the verification question correctly.';
      this.resetChallenge();
      return;
    }

    this.submitting = true;
    this.error = null;
    this.successMessage = null;

    this.contactService
      .send({ name, email, message })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.submitting = false;
          this.successMessage = 'Thanks! Your message was sent. We will get back to you soon.';
          this.clearFields();
          this.resetChallenge();
          this.formOpenedAt = Date.now();
        },
        error: (err) => {
          this.submitting = false;
          this.error = 'Could not send your message. Please try again.';
          console.error('Contact submission failed', err);
        },
      });
  }

  private clearFields(): void {
    this.name = '';
    this.email = '';
    this.message = '';
    this.company = '';
    this.challengeAnswer = '';
  }

  private resetChallenge(): void {
    this.challengeA = 1 + Math.floor(Math.random() * 9);
    this.challengeB = 1 + Math.floor(Math.random() * 9);
    this.challengeAnswer = '';
  }
}

import {DOCUMENT} from '@angular/common';
import {Inject, Injectable, InjectionToken, NgZone, Provider} from '@angular/core';
import {Observable, from, of, shareReplay, switchMap, throwError} from 'rxjs';

import {RecaptchaAction, RecaptchaUnavailableError} from './recaptcha.model';
import {RECAPTCHA_SITE_KEY} from './recaptcha.config';

const SCRIPT_ID = 'google-recaptcha-v3';

interface GrecaptchaApi {
  ready(callback: () => void): void;
  execute(siteKey: string, options: { action: string }): Promise<string>;
}

/**
 * Loads Google reCAPTCHA v3 once, then returns a per-submit token for a named action.
 */
@Injectable()
export class RecaptchaService {
  private api$?: Observable<GrecaptchaApi>;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(RECAPTCHA_SITE_KEY) private readonly siteKey: string,
    private readonly zone: NgZone,
  ) {
  }

  execute(action: RecaptchaAction): Observable<string> {
    if (!this.isConfigured()) {
      return throwError(() => new RecaptchaUnavailableError());
    }

    return this.ensureApi().pipe(
      switchMap((api) => from(this.requestToken(api, action))),
      switchMap((token) => {
        if (!token?.trim()) {
          return throwError(() => new RecaptchaUnavailableError());
        }
        return of(token);
      }),
    );
  }

  private isConfigured(): boolean {
    return !!this.siteKey;
  }

  private ensureApi(): Observable<GrecaptchaApi> {
    if (!this.api$) {
      this.api$ = new Observable<GrecaptchaApi>((subscriber) => {
        const existing = this.existingApi();
        if (existing) {
          subscriber.next(existing);
          subscriber.complete();
          return;
        }

        const win = this.document.defaultView;
        if (!win) {
          subscriber.error(new RecaptchaUnavailableError());
          return;
        }

        const onReady = () => {
          // `api.js` installs only `grecaptcha.ready`; the rest of the API
          // arrives with a second bundle, so wait for `ready` before use.
          const bootstrap = this.bootstrapApi();
          if (!bootstrap) {
            subscriber.error(new RecaptchaUnavailableError());
            return;
          }

          // grecaptcha drains its ready queue outside Angular's zone.
          bootstrap.ready(() => this.zone.run(() => {
            const loaded = this.existingApi();
            if (!loaded) {
              subscriber.error(new RecaptchaUnavailableError());
              return;
            }
            subscriber.next(loaded);
            subscriber.complete();
          }));
        };

        let script = this.document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
        if (!script) {
          script = this.document.createElement('script');
          script.id = SCRIPT_ID;
          script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(this.siteKey)}`;
          script.async = true;
          script.defer = true;
          this.document.head.appendChild(script);
        }

        script.addEventListener('load', onReady);
        script.addEventListener('error', () => {
          subscriber.error(new RecaptchaUnavailableError());
        });
      }).pipe(shareReplay({bufferSize: 1, refCount: false}));
    }

    return this.api$;
  }

  /** The `ready`-only surface published as soon as `api.js` is parsed. */
  private bootstrapApi(): Pick<GrecaptchaApi, 'ready'> | null {
    const grecaptcha = (
      this.document.defaultView as (Window & { grecaptcha?: Partial<GrecaptchaApi> }) | null
    )?.grecaptcha;
    return typeof grecaptcha?.ready === 'function' ? (grecaptcha as GrecaptchaApi) : null;
  }

  private existingApi(): GrecaptchaApi | null {
    const grecaptcha = (this.document.defaultView as Window & { grecaptcha?: GrecaptchaApi } | null) ?.grecaptcha;

    if (!grecaptcha?.ready || !grecaptcha.execute) {
      return null;
    }
    return grecaptcha;
  }

  private requestToken(api: GrecaptchaApi, action: RecaptchaAction): Promise<string> {
    return new Promise((resolve, reject) => {
      api.ready(() => this.zone.run(() => {
        api
          .execute(this.siteKey, {action})
          .then(resolve, () => reject(new RecaptchaUnavailableError()));
      }));
    });
  }
}

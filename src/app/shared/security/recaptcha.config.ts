import {environment} from '../../../environments/environment';
import {InjectionToken, Provider} from '@angular/core';

export const RECAPTCHA_SITE_KEY = new InjectionToken<string>('RECAPTCHA_SITE_KEY');

export const RECAPTCHA_SITE_KEY_PROVIDER: Provider = { provide: RECAPTCHA_SITE_KEY,  useValue: environment.recaptcha.siteKey }

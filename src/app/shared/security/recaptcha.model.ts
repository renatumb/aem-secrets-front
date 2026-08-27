/**
 * Named v3 actions. Must match the backend expected-action map for each POST.
 */
export type RecaptchaAction = 'subscribe' | 'contact' | 'comment';

/** Header the backend reads when verifying a public form POST. */
export const RECAPTCHA_TOKEN_HEADER = 'X-Recaptcha-Token';

export function recaptchaHeaders(token: string): { headers: Record<string, string> } {
  return { headers: { [RECAPTCHA_TOKEN_HEADER]: token } };
}

/** Thrown when the v3 script cannot load or does not return a token. */
export class RecaptchaUnavailableError extends Error {
  override readonly name = 'RecaptchaUnavailableError';

  constructor(message = 'reCAPTCHA is unavailable.') {
    super(message);
  }
}

export const RECAPTCHA_USER_MESSAGE = 'Could not verify this request. Please refresh and try again.';

import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { RecaptchaUnavailableError } from './recaptcha.model';
import { RECAPTCHA_SITE_KEY } from './recaptcha.config';
import { RecaptchaService } from './recaptcha.service';

describe('RecaptchaService', () => {
  function createGrecaptcha(token: string | Promise<string>) {
    return {
      ready: (callback: () => void) => callback(),
      execute: jasmine.createSpy('execute').and.returnValue(Promise.resolve(token)),
    };
  }

  function setup(siteKey: string, grecaptcha?: ReturnType<typeof createGrecaptcha>) {
    const view = { grecaptcha } as unknown as Window;
    const documentStub = {
      defaultView: view,
      getElementById: jasmine.createSpy('getElementById').and.returnValue(null),
      createElement: jasmine.createSpy('createElement'),
      head: { appendChild: jasmine.createSpy('appendChild') },
    };

    TestBed.configureTestingModule({
      providers: [
        RecaptchaService,
        { provide: RECAPTCHA_SITE_KEY, useValue: siteKey },
        { provide: DOCUMENT, useValue: documentStub },
      ],
    });

    return {
      service: TestBed.inject(RecaptchaService),
      grecaptcha,
    };
  }

  it('errors when the site key is missing', async () => {
    const { service } = setup('');

    await expectAsync(firstValueFrom(service.execute('subscribe'))).toBeRejectedWith(
      jasmine.any(RecaptchaUnavailableError),
    );
  });

  it('errors when the site key is still the placeholder', async () => {
    const { service } = setup('REPLACE_ME');

    await expectAsync(firstValueFrom(service.execute('contact'))).toBeRejectedWith(
      jasmine.any(RecaptchaUnavailableError),
    );
  });

  it('returns a token from grecaptcha.execute for the named action', async () => {
    const grecaptcha = createGrecaptcha('tok-1');
    const { service } = setup('site-key', grecaptcha);

    const token = await firstValueFrom(service.execute('comment'));

    expect(token).toBe('tok-1');
    expect(grecaptcha.execute).toHaveBeenCalledWith('site-key', { action: 'comment' });
  });

  it('errors when grecaptcha returns an empty token', async () => {
    const { service } = setup('site-key', createGrecaptcha(''));

    await expectAsync(firstValueFrom(service.execute('subscribe'))).toBeRejectedWith(
      jasmine.any(RecaptchaUnavailableError),
    );
  });
});

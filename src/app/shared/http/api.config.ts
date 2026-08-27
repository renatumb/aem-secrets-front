import { InjectionToken, Provider } from '@angular/core';
import { environment } from '../../../environments/environment';

/** Base URL for unauthenticated (reader / public) API requests. */
export const READER_API_BASE_URL = new InjectionToken<string>('PUBLIC_API_BASE_URL_TOKEN');

/** Base URL for authenticated (editor / admin) API requests. */
export const EDITOR_API_BASE_URL = new InjectionToken<string>('EDITOR_API_BASE_URL_TOKEN');

/** Providers that expose API base URLs from environment as DI tokens. */

export const READER_API_PROVIDER: Provider = { provide: READER_API_BASE_URL, useValue: environment.api.readerBaseUrl }
export const EDITOR_API_PROVIDER: Provider = { provide: EDITOR_API_BASE_URL, useValue: environment.api.editorBaseUrl }

import { HttpContext, HttpContextToken } from '@angular/common/http';

/** When true, AuthInterceptor attaches the Bearer token if present. */
export const AUTH_REQUIRED = new HttpContextToken<boolean>( () => false );

/** HttpClient options fragment that marks a request as editor/authenticated. */
export function withAuth(): { context: HttpContext } {
  const httpContext: HttpContext = new HttpContext() ;
  httpContext.set( AUTH_REQUIRED, true );
  return { context:  httpContext };
}

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CONTACT_ENDPOINTS } from '../../shared/http/contact-endpoints';
import { READER_API_BASE_URL } from '../../shared/http/api.config';
import { ContactMessageDto } from '../../shared/models/contact.model';

/**
 * Public contact service for the reader. Unauthenticated.
 * Accepts 202 Accepted with an empty body.
 */
@Injectable()
export class ContactService {
  constructor(
    @Inject(READER_API_BASE_URL) private readonly baseUrl: string,
    private readonly http: HttpClient,
  ) {}

  send(payload: ContactMessageDto): Observable<void> {
    return this.http
      .post(this.url(CONTACT_ENDPOINTS.reader.send()), payload, {
        observe: 'response',
        responseType: 'text',
      })
      .pipe(map(() => undefined));
  }

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}

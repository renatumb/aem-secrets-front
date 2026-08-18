import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SUBSCRIBER_ENDPOINTS } from '../../shared/http/subscriber-endpoints';
import { READER_API_BASE_URL } from '../../shared/http/api.config';
import {
  CreateSubscriberDto,
  Subscriber,
  UnsubscribeByTokenDto,
} from '../../shared/models/subscriber.model';

/**
 * Public subscriber service for the reader. Unauthenticated.
 * Only `create` is exposed — readers may subscribe but cannot read or modify the list.
 */
@Injectable()
export class SubscribersService {
  constructor(
    @Inject(READER_API_BASE_URL) private readonly baseUrl: string,
    private readonly http: HttpClient,
  ) {}

  create(payload: CreateSubscriberDto): Observable<Subscriber> {
    return this.http.post<Subscriber>(
      this.url(SUBSCRIBER_ENDPOINTS.reader.create()),
      payload,
    );
  }

  /** Deactivates a subscription using the signed token from newsletter emails. */
  unsubscribeByToken(token: string): Observable<void> {
    const payload: UnsubscribeByTokenDto = { token };
    return this.http.post<void>(
      this.url(SUBSCRIBER_ENDPOINTS.reader.unsubscribe()),
      payload,
    );
  }

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}

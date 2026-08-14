import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SUBSCRIBER_ENDPOINTS } from '../../shared/http/subscriber-endpoints';
import { EDITOR_API_BASE_URL } from '../../shared/http/api.config';
import { withAuth } from '../../core/auth/auth.context';
import {
  Subscriber,
  SubscriberListQuery,
  UpdateSubscriberStatusDto,
} from '../../shared/models/subscriber.model';

/**
 * Editor-only subscriber operations. Authenticated requests only.
 * Editors can: list, toggle active flag, delete.
 * Creation is intentionally absent — readers self-subscribe through the public service.
 */
@Injectable()
export class SubscribersService {
  constructor(
    @Inject(EDITOR_API_BASE_URL) private readonly baseUrl: string,
    private readonly http: HttpClient,
  ) {}

  list(query: SubscriberListQuery = {}): Observable<any> {
    const params = new HttpParams()
      .set('page', String(query.page ?? 0))
      .set('size', String(query.size ?? 100))
      .set('sort', query.sort ?? 'desc')
      .set('fields', query.fields ?? 'dateCreation,email')

    return this.http.get<any>(this.url(SUBSCRIBER_ENDPOINTS.editor.list()), { params, ...withAuth() });
  }

  switchActive(email: string, active: boolean): Observable<Subscriber> {
    const payload: UpdateSubscriberStatusDto = { enableSubscription : active };

    return this.http.patch<Subscriber>(
      this.url(SUBSCRIBER_ENDPOINTS.editor.switchActive(email)),
      payload,
      withAuth(),
    );
  }

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { POST_ENDPOINTS } from '../../shared/http/post-endpoints';
import { READER_API_BASE_URL } from '../../shared/http/api.config';
import { Post, PostListQuery } from '../../shared/models/post.model';

/**
 * Public post lookups for the reader. Unauthenticated.
 */
@Injectable()
export class PostsService {
  constructor(
    @Inject(READER_API_BASE_URL) private readonly baseUrl: string,
    private readonly http: HttpClient,
  ) {}

  list(query: PostListQuery = {}): Observable<any> {
    const params = new HttpParams()
      .set('page', String(query.page ?? 0))
      .set('size', String(query.size ?? 100))
      .set('sort', query.sort ?? 'desc')
      .set('orderBy', query.orderBy ?? 'title')
      //.set('categoryFilter', query.categoryFilter ?? 99999);

    return this.http.get<any>(this.url(POST_ENDPOINTS.reader.list()), { params });
  }

  getBySlug(slug: string): Observable<Post> {
    return this.http.get<Post>(this.url(POST_ENDPOINTS.reader.bySlug(slug)));
  }

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}

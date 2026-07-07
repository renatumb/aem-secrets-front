import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { POST_ENDPOINTS } from '../../shared/http/post-endpoints';
import { READER_API_BASE_URL } from '../../shared/http/api.config';
import { Post, PostListQuery } from '../../shared/models/post.model';

/** Normalized paged list response from the reader posts API. */
export interface PostListPage {
  posts: Post[];
  hasMore: boolean;
}

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

    let params = new HttpParams()
      .set('page', String(query.page ?? 0))
      .set('size', String(query.size ?? 100))
      .set('sort', query.sort ?? 'desc')
      .set('orderBy', query.orderBy ?? 'title');

    if (query.categoryFilter != null) {
      params = params.set('categoryFilter', String(query.categoryFilter));
    }

    if (query.highlight != null) {
      params = params.set('highlight', String(query.highlight));
    }

    return this.http.get<any>(this.url(POST_ENDPOINTS.reader.list()), { params });
  }

  listFeatured(): Observable<any> {
    return this.list({ highlight: true, orderBy: 'creationDate', size: 4 });
  }

  listLatest(page = 0, size = 6): Observable<any> {
    return this.list({
      page,
      size,
      sort: 'desc',
      orderBy: 'creationDate',
    });
  }

  listByCategory(categoryId: number, page = 0, size = 6): Observable<any> {
    return this.list({
      categoryFilter: categoryId,
      page,
      size,
      sort: 'desc',
      orderBy: 'creationDate',
    });
  }

  getBySlug(slug: string): Observable<Post> {
    return this.http.get<Post>(this.url(POST_ENDPOINTS.reader.bySlug(slug)));
  }

  mapPostsPage(response: unknown, page: number, pageSize: number): PostListPage {
    const posts = this.mapPostsResponse(response);
    const totalElements = (response as { totalElements?: number })?.totalElements;

    //const hasMore = totalElements != null ? (page + 1) * pageSize < totalElements : posts.length >= pageSize;
    const hasMore = !( (response as { last?: boolean })?.last );

    return { posts, hasMore };
  }

  mapPostsResponse(response: unknown): Post[] {
    if (Array.isArray(response)) {
      return response as Post[];
    }

    const paged = response as { content?: Post[] };
    return paged?.content ?? [];
  }

  /** Turns backend thumbnail paths (postId\\filename) into a browser-loadable URL. */
  resolveThumbnailUrl(thumbnail: string): string {
    if (!thumbnail) {
      return '';
    }

    if (/^https?:\/\//i.test(thumbnail)) {
      return thumbnail;
    }

    const parts = thumbnail.split(/[/\\]/).filter(Boolean);
    if (parts.length >= 2) {
      const fileName = parts[parts.length - 1];
      const postId = parts[parts.length - 2];
      return this.url(POST_ENDPOINTS.reader.downloadImage(postId, fileName));
    }

    return thumbnail;
  }

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}

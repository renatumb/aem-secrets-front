import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { POST_ENDPOINTS } from '../../shared/http/post-endpoints';
import { EDITOR_API_BASE_URL } from '../../shared/http/api.config';
import { withAuth } from '../../core/auth/auth.context';
import {
  PostDraft,
  Post,
  PostListQuery,
  PostStatus,
  UpdatePostHighlightDto,
  UpdatePostStatusDto,
  UploadPostImageResponse,
} from '../../shared/models/post.model';

/**
 * Editor-only post operations. All requests target the authenticated
 * (editor) base URL; the auth interceptor will attach the bearer token.
 */
@Injectable()
export class PostsService {
  constructor(
    @Inject(EDITOR_API_BASE_URL) private readonly baseUrl: string,
    private readonly http: HttpClient,
  ) {}

  createDraft(payload: PostDraft = {
    categories: [],
    statusPost: PostStatus.DRAFT
  }): Observable<Post> {
    return this.http.post<Post>(
      this.url(POST_ENDPOINTS.editor.createDraft()),
      payload,
      withAuth(),
    );
  }

  list(query: PostListQuery = {}): Observable<any> {
    let params = new HttpParams()
      .set('page', String(query.page ?? 0))
      .set('size', String(query.size ?? 100))
      .set('sort', query.sort ?? 'desc')
      .set('orderBy', query.orderBy ?? 'creationDate');

    if (query.categoryFilter != null) {
      params = params.set('categoryFilter', String(query.categoryFilter));
    }

    return this.http.get<any>(this.url(POST_ENDPOINTS.editor.list()), { params, ...withAuth() });
  }

  getById(id: string): Observable<Post> {
    return this.http.get<Post>(this.url(POST_ENDPOINTS.editor.byId(id)), withAuth());
  }

  update(id: string, payload: Post): Observable<Post> {
    return this.http.put<Post>(
      this.url(POST_ENDPOINTS.editor.update(id)),
      payload,
      withAuth(),
    );
  }

  updateStatus(id: string, status: PostStatus): Observable<Post> {
    const payload: UpdatePostStatusDto = { statusPost: status };

    return this.http.put<Post>(
      this.url(POST_ENDPOINTS.editor.update(id)),
      payload,
      withAuth(),
    );
  }

  updateHighlight(id: string, highlight: boolean): Observable<Post> {
    const payload: UpdatePostHighlightDto = { highlight };

    return this.http.put<Post>(
      this.url(POST_ENDPOINTS.editor.update(id)),
      payload,
      withAuth(),
    );
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(this.url(POST_ENDPOINTS.editor.remove(id)), withAuth());
  }

  uploadImage(postId: string, file: File, cover: boolean = false): Observable<UploadPostImageResponse> {
    const formData = new FormData();
    formData.append('selected_file', file);
    formData.append('postId', postId);
    // @ts-ignore
    formData.append('isCover', cover);

    return this.http.post<UploadPostImageResponse>(
      this.url(POST_ENDPOINTS.editor.uploadImage()),
      formData,
      withAuth(),
    );
  }

  /** Turns backend upload paths (postId\\filename) into a browser-loadable URL. */
  resolveUploadedImageUrl(imageUrl: string): string {
    if (/^https?:\/\//i.test(imageUrl)) {
      return imageUrl;
    }

    const parts = imageUrl.split(/[/\\]/).filter(Boolean);
    if (parts.length >= 2) {
      const fileName = parts[parts.length - 1];
      const postId = parts[parts.length - 2];
      return this.url(POST_ENDPOINTS.editor.downloadImage(postId, fileName));
    }
    return imageUrl;
  }

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}

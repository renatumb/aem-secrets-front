import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { COMMENT_ENDPOINTS } from '../../shared/http/comment-endpoints';
import { EDITOR_API_BASE_URL } from '../../shared/http/api.config';
import {
  Comment,
  CommentListQuery,
  StatusComment,
  UpdateCommentStatusDto,
} from '../../shared/models/comment.model';

/**
 * Editor-only comment operations. Authenticated requests only.
 */
@Injectable()
export class CommentsService {
  constructor(
    @Inject(EDITOR_API_BASE_URL) private readonly baseUrl: string,
    private readonly http: HttpClient,
  ) {}

  list(query: CommentListQuery = {}): Observable<any> {
    let params = new HttpParams()
      .set('page', String(query.page ?? 0))
      .set('size', String(query.size ?? 100));

    if (query.postId != null && query.postId !== '') {
      params = params.set('postId', query.postId);
    }

    if (query.orderBy != null && query.orderBy !== '') {
      params = params.set('orderBy', query.orderBy);
    }

    if (query.statusFilter != null) {
      params = params.set('statusFilter', query.statusFilter);
    }

    return this.http.get<any>(this.url(COMMENT_ENDPOINTS.editor.list()), { params });
  }

  updateStatus(id: number, statusComment: StatusComment): Observable<Comment> {
    const payload: UpdateCommentStatusDto = { statusComment };

    return this.http.put<Comment>(
      this.url(COMMENT_ENDPOINTS.editor.update(id)),
      payload,
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.url(COMMENT_ENDPOINTS.editor.remove(id)));
  }

  mapCommentsResponse(response: unknown): Comment[] {
    if (Array.isArray(response)) {
      return response as Comment[];
    }

    const paged = response as { content?: Comment[] };
    return paged?.content ?? [];
  }

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}

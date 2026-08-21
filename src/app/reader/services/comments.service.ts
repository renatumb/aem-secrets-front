import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { COMMENT_ENDPOINTS } from '../../shared/http/comment-endpoints';
import { READER_API_BASE_URL } from '../../shared/http/api.config';
import {
  Comment,
  CommentListQuery,
  CreateCommentDto,
  StatusComment,
} from '../../shared/models/comment.model';
import { recaptchaHeaders } from '../../shared/security/recaptcha.model';

/**
 * Public comment service for the reader. Unauthenticated.
 */
@Injectable()
export class CommentsService {
  constructor(
    @Inject(READER_API_BASE_URL) private readonly baseUrl: string,
    private readonly http: HttpClient,
  ) {}

  create(payload: CreateCommentDto, recaptchaToken: string): Observable<Comment> {
    return this.http.post<Comment>(
      this.url(COMMENT_ENDPOINTS.reader.create()),
      payload,
      recaptchaHeaders(recaptchaToken),
    );
  }

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

    return this.http.get<any>(this.url(COMMENT_ENDPOINTS.reader.list()), { params });
  }

  listAcceptedByPost(postId: string): Observable<Comment[]> {
    return this.list({
      postId,
      statusFilter: StatusComment.ACCEPTED ,
      orderBy: 'creationDate',
    }).pipe(map((response) => this.mapCommentsResponse(response)));
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

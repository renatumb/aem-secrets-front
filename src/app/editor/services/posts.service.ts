import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { POST_ENDPOINTS } from '../../shared/http/post-endpoints';
import { EDITOR_API_BASE_URL } from '../../shared/http/api.config';
import {
  Post,
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

  uploadImage(postId: string, file: File): Observable<UploadPostImageResponse> {
    const formData = new FormData();
    formData.append('selected_file', file);
    formData.append('postId', postId);

    return this.http.post<UploadPostImageResponse>(
      this.url(POST_ENDPOINTS.editor.uploadImage()),
      formData,
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

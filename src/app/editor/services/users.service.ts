import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { USER_ENDPOINTS } from '../../shared/http/user-endpoints';
import { EDITOR_API_BASE_URL } from '../../shared/http/api.config';
import { withAuth } from '../../core/auth/auth.context';
import {
  UpdateUserDto,
  User,
  UserListQuery,
} from '../../shared/models/user.model';

/**
 * Editor-only user operations. Authenticated requests only.
 * Editors can list, fetch by id, and partially update editable fields
 * (about, photo, accessLevel, accountLocked) via a single multipart PUT.
 * Create / delete / password change are intentionally absent.
 */
@Injectable()
export class UsersService {
  constructor(
    @Inject(EDITOR_API_BASE_URL) private readonly baseUrl: string,
    private readonly http: HttpClient,
  ) {}

  list(query: UserListQuery = {}): Observable<any> {
    const params = new HttpParams()
      .set('page', String(query.page ?? 0))
      .set('size', String(query.size ?? 100))
      .set('sort', query.sort ?? 'desc')
      .set('orderBy', query.orderBy ?? 'name');

    return this.http.get<any>(this.url(USER_ENDPOINTS.editor.list()), { params, ...withAuth() });
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(this.url(USER_ENDPOINTS.editor.byId(id)), withAuth());
  }

  /**
   * Partial update. Only defined fields are appended to FormData.
   * Include `photo` when uploading a new profile image.
   */
  update(id: string, payload: UpdateUserDto): Observable<User> {
    const formData = new FormData();

    if (payload.name !== undefined) {
      formData.append('name', payload.name);
    }
    if (payload.password !== undefined) {
      formData.append('password', payload.password);
    }
    if (payload.about !== undefined) {
      formData.append('about', payload.about);
    }
    if (payload.accessLevel !== undefined) {
      formData.append('accessLevel', payload.accessLevel);
    }
    if (payload.accountLocked !== undefined) {
      formData.append('accountLocked', String(payload.accountLocked));
    }
    if (payload.photo !== undefined) {
      formData.append('photo', payload.photo);
    }

    return this.http.patch<User>(
      this.url(USER_ENDPOINTS.editor.update(id)),
      formData,
      withAuth(),
    );
  }
  //
  resolvePhotoProfileUrl(photoProfile: string): string {
    if (/^https?:\/\//i.test(photoProfile)) {
      return photoProfile;
    }

    return this.url(USER_ENDPOINTS.editor.downloadImage(photoProfile));
  }

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}

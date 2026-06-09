import {HttpClient, HttpParams} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CATEGORY_ENDPOINTS} from '../../shared/http/category-endpoints';
import {EDITOR_API_BASE_URL} from '../../shared/http/api.config';
import {Category, CategoryListQuery, CreateUpdateCategoryDto} from '../../shared/models/category.model';

/**
 * Editor-only category operations. All requests target the authenticated
 * (editor) base URL; the auth interceptor will attach the bearer token.
 */
@Injectable()
export class CategoriesService {

  constructor(@Inject(EDITOR_API_BASE_URL) private readonly baseUrl: string,
              private readonly http: HttpClient,
  ) {
  }

  list(query: CategoryListQuery = {}): Observable<any> {
    const params = new HttpParams()
      .set('page', String(query.page ?? 0))
      .set('size', String(query.size ?? 100))
      .set('sort', query.sort ?? 'asc')
      .set('sortedBy', query.sortedBy ?? 'id');

    return this.http.get<any>(
      this.url(CATEGORY_ENDPOINTS.editor.list()),
      {params}
    );
  }

  create(payload: CreateUpdateCategoryDto): Observable<Category> {
    return this.http.post<Category>(
      this.url(CATEGORY_ENDPOINTS.editor.create()),
      payload);
  }

  update(id: number, payload: CreateUpdateCategoryDto): Observable<Category> {
    return this.http.put<Category>(
      this.url(CATEGORY_ENDPOINTS.editor.update(id)),
      payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>( this.url(CATEGORY_ENDPOINTS.editor.remove(id) ) );
  }

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}

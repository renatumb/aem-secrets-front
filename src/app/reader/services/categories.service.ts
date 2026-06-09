import {HttpClient, HttpParams} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CATEGORY_ENDPOINTS} from '../../shared/http/category-endpoints';
import {READER_API_BASE_URL} from '../../shared/http/api.config';
import {Category, CategoryListQuery} from '../../shared/models/category.model';

/**
 * Public category lookups for the reader. Unauthenticated.
 */
@Injectable()
export class CategoriesService {
  constructor( @Inject(READER_API_BASE_URL) private readonly baseUrl: string,
                                            private readonly http: HttpClient){
  }

  list(query: CategoryListQuery = {}): Observable<any> {

    const params = new HttpParams()
      .set('page', String(query.page ?? 0))
      .set('size', String(query.size ?? 100))
      .set('sort', query.sort ?? 'asc')
      .set('sortedBy', query.sortedBy ?? 'name,description');

    return this.http.get<any>(
      this.url(CATEGORY_ENDPOINTS.reader.list()),
      {params},
    );
  }

  getByName(name: string): Observable<Category> {
    return this.http.get<Category>(this.url(CATEGORY_ENDPOINTS.reader.byName(name)));
  }

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}

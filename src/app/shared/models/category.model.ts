/**
 * Category domain contract used by both reader and editor services.
 */
export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface CreateUpdateCategoryDto {
  name: string;
  description: string;
}

/** Query options for paged/sorted category lookups. */
export interface CategoryListQuery {
  page?: number;
  size?: number;
  sort?: 'asc' | 'desc';
  sortedBy?: string;
}

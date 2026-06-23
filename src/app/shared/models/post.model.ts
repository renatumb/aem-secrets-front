import {Category} from './category.model';

/**
 * Post domain contract used by both reader and editor services.
 */
export interface Post {
  id: string
  content_en: string
  creation_date: string
  description: string
  highlight: boolean
  last_modification_date: string
  permalink: string
  tags: string[]
  thumbnail: string
  title: string
  user_id: string
}

/** Response returned after uploading a post image. */
export interface UploadPostImageResponse {
  imageUrl: string;
}

export interface PostDraft {
  categories: Category[]
  statusPost: string
}

/** Query options for paged/sorted post lookups. */
export interface PostListQuery {
  page?: number;
  size?: number;
  sort?: 'asc' | 'desc';
  orderBy?: string;
  categoryFilter?: number;
}

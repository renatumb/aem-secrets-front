import {Category} from './category.model';

/**
 * Post domain contract used by both reader and editor services.
 */
export interface Post {
  id: string
  permalink: string
  title: string
  description: string
  thumbnail: string
  content_en: string
  creationDate: string
  lastModificationDate: string
  highlight: boolean
  tags: string[]
  categories: Category[]
  author: string
  comment: string[]
  statusPost: PostStatus
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  UNPUBLISHED = 'UNPUBLISHED'
}

/** Response returned after uploading a post image. */
export interface UploadPostImageResponse {
  imageUrl: string;
}

export interface PostDraft {
  categories: Category[]
  statusPost: string
}

/** Partial update payload for post status. */
export interface UpdatePostStatusDto {
  statusPost: PostStatus;
}

/** Partial update payload for post highlight flag. */
export interface UpdatePostHighlightDto {
  highlight: boolean;
}

/** Query options for paged/sorted post lookups. */
export interface PostListQuery {
  page?: number;
  size?: number;
  sort?: 'asc' | 'desc';
  orderBy?: string;
  categoryFilter?: number;
}

/**
 * Comment domain contract aligned with the backend Comment entity.
 * Date fields are ISO 8601 strings as returned by the API.
 */
export enum StatusComment {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
}

export interface Comment {
  id: number;
  content: string;
  nameAuthor: string;
  emailAuthor: string;
  creationDate: string;
  statusDate: string;
  statusComment: StatusComment;
  post?: {
    id: string;
  };
}

/** Public reader payload for submitting a new comment. */
export interface CreateCommentDto {
  nameAuthor: string;
  emailAuthor: string;
  content: string;
  post: {
    id: string;
  };
}

/** Query options for paged comment lookups. */
export interface CommentListQuery {
  postId?: string;
  page?: number;
  size?: number;
  orderBy?: string;
  statusFilter?: StatusComment;
}

/** Editor payload for updating comment moderation status. */
export interface UpdateCommentStatusDto {
  statusComment: StatusComment;
}

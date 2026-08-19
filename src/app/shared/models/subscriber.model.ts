/**
 * Subscriber domain contract used by both reader and editor services.
 * Date fields are ISO 8601 strings as returned by the backend.
 */
export enum StatusChangeSource {
  SUBSCRIBE = 'SUBSCRIBE',
  UNSUBSCRIBE_LINK = 'UNSUBSCRIBE_LINK',
  EDITOR_PATCH = 'EDITOR_PATCH',
}

export interface Subscriber {
  email: string;
  name: string;
  dateCreation: string;
  dateStatus: string;
  enableSubscription: boolean;
  statusChangeSource: StatusChangeSource;
}

/** Public-form payload for creating a new subscriber. */
export interface CreateSubscriberDto {
  email: string;
  name: string;
}

/** Editor payload for toggling a subscriber's active flag. */
export interface UpdateSubscriberStatusDto {
  enableSubscription: boolean;
}

/** Query options for paged/sorted subscriber lookups (editor). */
export interface SubscriberListQuery {
  page?: number;
  size?: number;
  sort?: 'asc' | 'desc'
  fields?: string;
}

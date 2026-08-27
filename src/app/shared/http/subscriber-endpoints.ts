/**
 * Subscriber endpoint paths, partitioned by audience.
 *
 * - `reader.*` paths are appended to READER_API_BASE_URL (no auth).
 *   Public subscription is the only available action.
 * - `editor.*` paths are appended to EDITOR_API_BASE_URL (bearer token).
 *   Editors can list and toggle status.
 */
export const SUBSCRIBER_ENDPOINTS = {
  reader: {
    create: () => '/subscriber',
    /** Token from newsletter unsubscribe links: PUT `/subscriber/unsubscribe/{token}` (no body). */
    unsubscribe: (token:string) => '/subscriber/unsubscribe/' + token,
  },
  editor: {
    list: () => '/subscriber',
    switchActive: (email: string) => `/subscriber/${encodeURIComponent(email)}`,
  },
} as const;

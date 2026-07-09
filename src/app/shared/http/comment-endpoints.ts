/**
 * Comment endpoint paths, partitioned by audience.
 *
 * - `reader.*` paths are appended to READER_API_BASE_URL (no auth).
 * - `editor.*` paths are appended to EDITOR_API_BASE_URL (bearer token).
 */
export const COMMENT_ENDPOINTS = {
  reader: {
    list: () => '/comment',
    create: () => '/comment',
  },
  editor: {
    list: () => '/comment',
  },
} as const;

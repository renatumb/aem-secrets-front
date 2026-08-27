/**
 * Contact endpoint paths, partitioned by audience.
 *
 * - `reader.*` paths are appended to READER_API_BASE_URL (no auth).
 */
export const CONTACT_ENDPOINTS = {
  reader: {
    send: () => '/contact/send',
  },
} as const;

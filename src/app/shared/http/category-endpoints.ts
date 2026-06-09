/**
 * Category endpoint paths, partitioned by audience.
 *
 * - `reader.*` paths are appended to PUBLIC_API_BASE_URL (no auth).
 * - `editor.*` paths are appended to EDITOR_API_BASE_URL (bearer token).
 *
 * Builders encode path params safely and give the call site type-checked args.
 */
export const CATEGORY_ENDPOINTS = {
  reader: {
    list: () => '/category',
    byName: (name: string) => `/category/${encodeURIComponent(name)}`,
  },
  editor: {
    list: () => '/category',
    create: () => '/category',
    update: (id: number) => `/category/${encodeURIComponent(String(id))}`,
    remove: (id: number) => `/category/${encodeURIComponent(String(id))}`,
  },
} as const;

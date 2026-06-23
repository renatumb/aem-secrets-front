/**
 * Post endpoint paths, partitioned by audience.
 *
 * - `reader.*` paths are appended to READER_API_BASE_URL (no auth).
 * - `editor.*` paths are appended to EDITOR_API_BASE_URL (bearer token).
 */
export const POST_ENDPOINTS = {
  reader: {
    list: () => '/post',
    bySlug: (slug: string) => `/post/${encodeURIComponent(slug)}`,
  },
  editor: {
    list: () => '/post',
    createDraft: () => '/post',
    uploadImage: () => '/post/image',
    downloadImage: (postIdParam : string, fileNameParam: string) => `/post/image?postID=${postIdParam}&filename=${fileNameParam}`,
  },
} as const;

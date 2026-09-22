/**
 * User endpoint paths, partitioned by audience.
 *
 * - `reader.*` paths are appended to READER_API_BASE_URL (no auth).
 *   Public profile photo download for post author bios.
 * - `editor.*` paths are appended to EDITOR_API_BASE_URL (bearer token).
 *   Editors can list, fetch by id, update (including optional photo), and download profile images.
 */
export const USER_ENDPOINTS = {
  reader: {
    downloadImage: (fileNameParam: string) =>
      `/user/profilephoto/${encodeURIComponent(fileNameParam)}`,
  },
  editor: {
    list: () => '/user',
    byId: (id: string) => `/user/${encodeURIComponent(id)}`,
    /** Multipart PATCH: any subset of password, about, photo, accessLevel, accountLocked. */
    update: (id: string) => `/user/${encodeURIComponent(id)}`,
    downloadImage: (fileNameParam: string) =>
      `/user/profilephoto/${encodeURIComponent(fileNameParam)}`,
  },
} as const;

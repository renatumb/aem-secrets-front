/**
 * User endpoint paths for the editor audience.
 *
 * - `editor.*` paths are appended to EDITOR_API_BASE_URL (bearer token).
 *   Editors can list, fetch by id, update (including optional photo), and download profile images.
 */
export const USER_ENDPOINTS = {
  editor: {
    list: () => '/user',
    byId: (id: string) => `/user/${encodeURIComponent(id)}`,
    /** Multipart PATCH: any subset of pass word, about, photo, accessLevel, accountLocked. */
    update: (id: string) => `/user/${encodeURIComponent(id)}`,
    downloadImage: (userIdParam: string, fileNameParam: string) =>
      `/user/image?userID=${userIdParam}&filename=${fileNameParam}`,
  },
} as const;

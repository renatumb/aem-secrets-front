/** Production environment configuration. */
export const environment = {
  production: true,
  api: {
    /** Relative base so the host/proxy/IIS can route to the API (same prefix as local BE). */
    readerBaseUrl: '/api',
    /** Relative base for authenticated editor requests. */
    editorBaseUrl: '/api',
  },
} as const;

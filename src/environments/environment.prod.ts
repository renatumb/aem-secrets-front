/** Production environment configuration. */
export const environment = {
  production: true,
  api: {
    publicBaseUrl: '/api/v1',
    editorBaseUrl: '/api/v1',
  },
} as const;

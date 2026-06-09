/**
 * Development environment configuration.
 * Override per-environment via angular.json `fileReplacements`.
 */
export const environment = {
  production: false,
  api: {
    /** Base URL used by public (reader) services. No auth. */
    readerBaseUrl: 'http://localhost:8090/api',
    /** Base URL used by editor (admin) services. Requires bearer token. */
    editorBaseUrl: 'http://localhost:8090/api',
  },
} as const;

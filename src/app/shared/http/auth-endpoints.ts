/**
 * Auth endpoint paths.
 * Login is unauthenticated; other editor calls use AUTH_REQUIRED via HttpContext.
 */
export const AUTH_ENDPOINTS = {
  login: () => '/login',
} as const;

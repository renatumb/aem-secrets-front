/**
 * Maps unknown HTTP/runtime errors to a safe UI message.
 * Never returns backend payloads, URLs, or stack details.
 */
export function toUserMessage(_err: unknown, fallback: string): string {
  return fallback;
}

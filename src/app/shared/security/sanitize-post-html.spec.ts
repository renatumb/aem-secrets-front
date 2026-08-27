import { sanitizePostHtml } from './sanitize-post-html';

describe('sanitizePostHtml', () => {
  it('keeps normal post markup', () => {
    const html = '<p>Hello <strong>world</strong></p><ul><li>One</li></ul>';
    expect(sanitizePostHtml(html)).toContain('<p>');
    expect(sanitizePostHtml(html)).toContain('<strong>world</strong>');
    expect(sanitizePostHtml(html)).toContain('<li>One</li>');
  });

  it('keeps links and images with http(s) or relative URLs', () => {
    const html =
      '<p><a href="https://example.com">site</a></p><img src="/api/post/image?postID=1&amp;filename=a.jpg" alt="cover">';
    const clean = sanitizePostHtml(html);
    expect(clean).toContain('href="https://example.com"');
    expect(clean).toContain('src="/api/post/image');
  });

  it('strips script tags and javascript URLs', () => {
    const html = '<p>Hi</p><script>alert(1)</script><a href="javascript:alert(1)">x</a>';
    const clean = sanitizePostHtml(html);
    expect(clean.toLowerCase()).not.toContain('<script');
    expect(clean.toLowerCase()).not.toContain('javascript:');
  });

  it('strips event-handler attributes', () => {
    const html = '<img src="/x.jpg" onerror="alert(1)"><p onclick="alert(1)">Hi</p>';
    const clean = sanitizePostHtml(html);
    expect(clean.toLowerCase()).not.toContain('onerror');
    expect(clean.toLowerCase()).not.toContain('onclick');
  });

  it('strips iframe and svg', () => {
    const html = '<iframe src="https://evil.test"></iframe><svg><script>alert(1)</script></svg><p>ok</p>';
    const clean = sanitizePostHtml(html);
    expect(clean.toLowerCase()).not.toContain('<iframe');
    expect(clean.toLowerCase()).not.toContain('<svg');
    expect(clean).toContain('<p>ok</p>');
  });

  it('adds rel on target=_blank links', () => {
    const html = '<a href="https://example.com" target="_blank">out</a>';
    const clean = sanitizePostHtml(html);
    expect(clean).toContain('rel="noopener noreferrer"');
  });

  it('returns empty string for nullish input', () => {
    expect(sanitizePostHtml(null)).toBe('');
    expect(sanitizePostHtml(undefined)).toBe('');
    expect(sanitizePostHtml('')).toBe('');
  });
});

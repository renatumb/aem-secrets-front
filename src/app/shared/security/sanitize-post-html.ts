import DOMPurify from 'dompurify';

/**
 * Tags the post editor is allowed to persist and the reader is allowed to render.
 * Matches typical angular-editor output (headings, lists, links, images, tables).
 */
const ALLOWED_TAGS = [
  'p',
  'br',
  'hr',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'strike',
  'sub',
  'sup',
  'blockquote',
  'pre',
  'code',
  'ul',
  'ol',
  'li',
  'a',
  'img',
  'span',
  'div',
  'font',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
];

const ALLOWED_ATTR = [
  'href',
  'target',
  'rel',
  'src',
  'alt',
  'title',
  'width',
  'height',
  'style',
  'class',
  'align',
  'color',
  'face',
  'size',
  'colspan',
  'rowspan',
];

let hooksRegistered = false;

function registerHooks(): void {
  if (hooksRegistered) {
    return;
  }
  hooksRegistered = true;

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (!(node instanceof Element)) {
      return;
    }

    if (node.tagName === 'A') {
      const href = node.getAttribute('href') ?? '';
      if (!/^(https?:|mailto:|\/|#)/i.test(href)) {
        node.removeAttribute('href');
      }
      if (node.getAttribute('target') === '_blank') {
        node.setAttribute('rel', 'noopener noreferrer');
      }
    }

    if (node.tagName === 'IMG') {
      const src = node.getAttribute('src') ?? '';
      if (!/^(https?:|\/|data:image\/)/i.test(src)) {
        node.removeAttribute('src');
      }
    }
  });
}

/**
 * Allowlist-sanitize HTML stored as post body.
 * Safe to run on save and again on display.
 */
export function sanitizePostHtml(dirty: string | null | undefined): string {
  if (!dirty) {
    return '';
  }

  registerHooks();

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'link', 'meta', 'base', 'svg', 'math'],
    FORBID_ATTR: ['srcdoc'],
  });
}

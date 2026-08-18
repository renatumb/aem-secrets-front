import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { sanitizePostHtml } from './sanitize-post-html';

/**
 * Allowlist-sanitizes HTML, then marks it trusted so Angular does not
 * strip remaining safe formatting (e.g. editor text-align / color styles).
 * Only use after sanitizePostHtml — never on raw API HTML.
 */
@Pipe({
  name: 'safeHtml',
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  transform(html: string | null | undefined): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(sanitizePostHtml(html));
  }
}

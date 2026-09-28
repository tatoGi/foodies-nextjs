import sanitizeHtml from 'sanitize-html';

const OPTIONS: sanitizeHtml.IOptions = {
  ...sanitizeHtml.defaults,
  allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowProtocolRelative: false
};

/** Rich text from the CMS, cleaned before it goes into dangerouslySetInnerHTML (no scripts, handlers or javascript: links). */
export function cleanHtml(html: string): string {
  return sanitizeHtml(html, OPTIONS);
}

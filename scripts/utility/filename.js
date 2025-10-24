/**
 * Cleans and normalizes a race title string.
 * Removes problematic characters and trims whitespace.
 */
export function normalizeTitle(title = '') {
  if (!title) return '';

  return title
    // Trim leading/trailing whitespace
    .trim()
    // Normalize curly quotes to straight quotes
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    // Remove HTML entities if any appear (e.g., &amp;)
    .replace(/&amp;/gi, '&')
    .replace(/&nbsp;/gi, ' ')
    // Collapse multiple spaces into one
    .replace(/\s{2,}/g, ' ')
    // Remove stray trailing punctuation (optional)
    .replace(/[–—-]\s*$/, '')
    // Ensure safe ASCII characters only (optional sanitization)
    .normalize('NFKC');
}

export function toSafeFileName(title = '') {
    return normalizeTitle(title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

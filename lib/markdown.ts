import { marked } from 'marked';

// Configure marked once: GitHub-flavored, line-breaks treated as <br>, no mangling.
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Render Markdown to HTML string. Synchronous (no async highlighter).
 * Output is meant to be injected via dangerouslySetInnerHTML inside a
 * div with `.prose-kukirin` styling.
 */
export function renderMarkdown(md: string | null | undefined): string {
  if (!md) return '';
  // marked.parse can return string | Promise<string> depending on options.
  // With async:false (default) it's string.
  const html = marked.parse(md, { async: false }) as string;
  return html;
}

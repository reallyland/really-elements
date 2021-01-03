export function hasCodeSnippetRendered(node: HTMLElement) {
  const $ = (e: string) => node.shadowRoot?.querySelector<HTMLElement>(e);
  const h2CodeSnippet = $('.all-code-snippets-container > h2');
  const h3Properties = $('.all-code-snippets-container > h3.properties');
  const h3CssProperties = $('.all-code-snippets-container > h3.css-properties');

  return h2CodeSnippet != null && h3Properties != null && h3CssProperties != null;
}

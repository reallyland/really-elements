export function hasCssPropertiesRendered(node: HTMLElement): boolean {
  const h2CssProperties = node.shadowRoot?.querySelector<HTMLHeadingElement>(
    '.all-properties-container h2.css-properties'
  );
  return h2CssProperties != null;
}

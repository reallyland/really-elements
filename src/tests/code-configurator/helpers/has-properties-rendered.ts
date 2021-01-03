export function hasPropertiesRendered(node: HTMLElement) {
  const h2Properties =
    node.shadowRoot?.querySelector<HTMLHeadingElement>('.all-properties-container h2.properties');
  return h2Properties != null;
}

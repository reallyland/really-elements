export function getAssignedNodes(node: HTMLElement): HTMLElement[] {
  const slotEl = node.shadowRoot!.querySelector('slot') as HTMLSlotElement;
  const assignedNodes = Array.from(slotEl.assignedNodes()).filter(
    n => n.nodeType === Node.ELEMENT_NODE
  ) as HTMLElement[];

  return assignedNodes;
}

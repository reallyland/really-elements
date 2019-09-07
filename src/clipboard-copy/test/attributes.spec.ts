import { ReallyClipboardCopy } from '../clipboard-copy.js';

import { getTestName } from '../../test/test-helpers.js';
import '../clipboard-copy.js';

const { strictEqual } = chai.assert;
const localName = 'really-clipboard-copy';

let el: ReallyClipboardCopy;

describe(getTestName(localName), () => {
  describe('attributes', () => {
    const getAssignedNodes = (node: HTMLElement) => {
      const slotEl = node.shadowRoot!.querySelector('slot') as HTMLSlotElement;
      const assignedNodes = Array.from(slotEl.assignedNodes()).filter(
        n => n.nodeType === Node.ELEMENT_NODE);

      return assignedNodes;
    };

    beforeEach(async () => {
      el = document.createElement(localName) as ReallyClipboardCopy;
      document.body.appendChild(el);

      await el.updateComplete;
    });

    afterEach(() => {
      document.body.removeChild(el);
    });

    it(`renders with initial attributes`, () => {
      strictEqual(el.getAttribute('forslot'), null, `'forslot' not set`);
      strictEqual(el.getAttribute('idslot'), null, `'idslot' not set`);

      strictEqual(el.forSlot, `copy-for`, `'forSlot' not matched`);
      strictEqual(el.idSlot, `copy-id`, `'idSlot' not matched`);

      strictEqual(el.innerHTML, '', `Expected no nodes in light DOM`);
      strictEqual(
        getAssignedNodes(el).length,
        0,
        `No assigned nodes should render in shadow root`);
    });

    it(`renders with defined attributes`, async () => {
      el.setAttribute('sync', '');
      el.setAttribute('idslot', 'id');
      el.setAttribute('forslot', 'for');
      await el.updateComplete;

      strictEqual(el.getAttribute('forslot'), 'for', `'forslot' not set`);
      strictEqual(el.getAttribute('idslot'), 'id', `'idslot' not set`);
      strictEqual(el.getAttribute('sync'), '', `'sync' not set`);

      strictEqual(el.forSlot, 'for', `'forSlot' not updated`);
      strictEqual(el.idSlot, 'id', `'idSlot' not updated`);
      strictEqual(el.sync, true, `'sync' not updated`);

      strictEqual(el.innerHTML, '', `Expected no nodes in light DOM`);
      strictEqual(
        getAssignedNodes(el).length,
        0,
        `No assigned nodes should render in shadow root`);
    });
  });

});

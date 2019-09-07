import { ReallyClipboardCopy } from '../clipboard-copy.js';

import { getTestName } from '../../test/test-helpers.js';
import '../clipboard-copy.js';

const { strictEqual } = chai.assert;
const localName = 'really-clipboard-copy';

let el: ReallyClipboardCopy;

describe(getTestName(localName), () => {
  describe('initial render', () => {
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

    it(`renders with no nodes`, () => {
      strictEqual(el.innerHTML, '', `Expected no nodes on initial render`);
      strictEqual(getAssignedNodes(el).length, 0, `Expected no assigned nodes in shadow root`);
    });

    it(`renders with nodes (div + button) in light DOM`, async () => {
      const divEl = document.createElement('div');
      const buttonEl = document.createElement('button');

      divEl.textContent = 'Hello, World!';
      divEl.setAttribute('copy-id', 'copiable');

      buttonEl.textContent = 'Copy';
      buttonEl.setAttribute('copy-for', 'copiable');

      el.appendChild(divEl);
      el.appendChild(buttonEl);

      await el.updateComplete;

      strictEqual(
        el.innerHTML,
        [
          '<div copy-id="copiable">Hello, World!</div>',
          '<button copy-for="copiable">Copy</button>',
        ].join(''),
        `Expected nodes (div + button) in light DOM`);
      strictEqual(getAssignedNodes(el).length, 2, `Expected assigned nodes`);
    });

    it(`renders with nested nodes (div + button) in light DOM`, async () => {
      const divEl = document.createElement('div');
      const buttonEl = document.createElement('button');
      const containerEl = document.createElement('div');

      divEl.textContent = 'Hello, World!';
      divEl.setAttribute('copy-id', 'copiable');

      buttonEl.textContent = 'Copy';
      buttonEl.setAttribute('copy-for', 'copiable');

      containerEl.appendChild(divEl);
      containerEl.appendChild(buttonEl);

      el.appendChild(containerEl);

      await el.updateComplete;

      strictEqual(
        el.innerHTML,
        [
          '<div>',
          '<div copy-id="copiable">Hello, World!</div>',
          '<button copy-for="copiable">Copy</button>',
          '</div>',
        ].join(''),
        `Expected nodes (div + button) in light DOM`);
      strictEqual(getAssignedNodes(el).length, 1, `Expected assigned nodes`);
    });

    it(`renders with defined properties and nodes (div + button) in light DOM`, async () => {
      const divEl = document.createElement('div');
      const buttonEl = document.createElement('button');

      divEl.textContent = 'Hello, World!';
      divEl.setAttribute('copy-id', 'copiable');

      buttonEl.textContent = 'Copy';
      buttonEl.setAttribute('copy-for', 'copiable');

      el.appendChild(divEl);
      el.appendChild(buttonEl);

      el.idSlot = 'copy-id';
      el.forSlot = 'copy-for';
      await el.updateComplete;

      strictEqual(
        el.innerHTML,
        [
          '<div copy-id="copiable">Hello, World!</div>',
          '<button copy-for="copiable">Copy</button>',
        ].join(''),
        `Expected nodes (div + button) in light DOM`);
      strictEqual(getAssignedNodes(el).length, 2, `Expected assigned nodes`);
    });

    it(`renders with 'sync' attribute`, async () => {
      const divEl = document.createElement('div');
      const buttonEl = document.createElement('button');

      divEl.textContent = 'Hello, World!';
      divEl.setAttribute('copy-id', 'copiable');

      buttonEl.textContent = 'Copy';
      buttonEl.setAttribute('copy-for', 'copiable');

      el.appendChild(divEl);
      el.appendChild(buttonEl);

      el.sync = true;
      el.idSlot = 'copy-id';
      el.forSlot = 'copy-for';
      await el.updateComplete;

      strictEqual(
        el.innerHTML,
        [
          '<div copy-id="copiable">Hello, World!</div>',
          '<button copy-for="copiable">Copy</button>',
        ].join(''),
        `Expected nodes (div + button) in light DOM`);
      strictEqual(el.hasAttribute('sync'), true, `'sync' attribute not set`);
      strictEqual(getAssignedNodes(el).length, 2, `Expected assigned nodes`);
    });

  });

});

import type { ReallyClipboardCopy } from '../clipboard-copy.js';

import { getTestName } from '../../test/test-helpers.js';
import '../clipboard-copy.js';

const { strictEqual } = chai.assert;
const localName = 'really-clipboard-copy';

let el: ReallyClipboardCopy;

describe(getTestName(localName), () => {
  describe('custom-events', () => {
    beforeEach(async () => {
      el = document.createElement(localName) as ReallyClipboardCopy;
      document.body.appendChild(el);

      await el.updateComplete;
    });

    afterEach(() => {
      document.body.removeChild(el);
    });

    it(`fires custom event`, async () => {
      const divEl = document.createElement('div');
      const buttonEl = document.createElement('button');

      divEl.textContent = 'Hello, World!';
      divEl.setAttribute('copy-id', 'copiable');

      buttonEl.textContent = 'Copy';
      buttonEl.setAttribute('copy-for', 'copiable');

      el.appendChild(divEl);
      el.appendChild(buttonEl);

      await el.updateComplete;

      /**
       * NOTE(motss): Some browsers prohibit user-generated event handler.
       * Here attempt to test for 2 different custom events and see if any of these fires.
       * As long as any of these fulfills, the tests should pass.
       */
      const eventFired = new Promise<[Error|null, string|null]>((yay) => {
        setTimeout(() => yay([new Error('timeout'), null]), 10e3);

        el.addEventListener('copy-error', ev =>
          yay([ev.detail.reason, null]));
        el.addEventListener('copy-success', ev => yay([null, ev.detail.value]));
      });

      /** NOTE(motss): Document needs to be focused first */
      window.focus();
      buttonEl.click();
      await el.updateComplete;

      const [r, v] = await eventFired;

      if (r) {
        strictEqual([DOMException, Error].some(n => r instanceof n), true, `'r' not matched`);

        const rMessage = r.message;
        strictEqual([
          'Failed to copy',
          'Document is not focused',
          'Write permission denied.',
        ].some(n => n === rMessage), true, `'r'[message] not matched`);
        strictEqual(v, null, `'v' should be null`);
      } else {
        strictEqual(r, null, `'r' should be null`);
        strictEqual(v, 'Hello, World!', `'v' not matched`);
      }
    });

  });

});

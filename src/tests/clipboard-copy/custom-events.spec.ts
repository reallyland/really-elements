import { assert, fixture, html } from '@open-wc/testing';

import type { ReallyClipboardCopy } from '../../clipboard-copy/really-clipboard-copy.js';
import '../../clipboard-copy/really-clipboard-copy.js';
import { pageClick } from '../wtr-helpers/page-click.js';
// import { grantBrowerPermissions } from './wtr-helpers/grant-browser-permissions.js';

describe('custom-events', () => {
  // beforeEach(async function beforeEachFn() {
  //   try {
  //     /**
  //      * NOTE: While this is not needed for `document.execCommand('copy');`,
  //      * this causes no harm to grant permission to clipboard access.
  //      */
  //     const granted = await grantBrowerPermissions([
  //       'clipboard-read',
  //       'clipboard-write',
  //     ]);

  //     if (!granted) this.skip();

  //     /**
  //      * NOTE: Webkit has no `navigator.permissions`.
  //      *
  //      * @see {@link https://caniuse.com/permissions-api|Permissions API}
  //      */
  //     const { state } = await navigator?.permissions?.query({
  //       name: 'clipboard-read' as never,
  //     });

  //     if (state !== 'granted') this.skip();
  //   } catch {
  //     this.skip();
  //   }
  // });

  // skip firefox,microsoftedge,safari
  it(`fires copy-success when the copy is successful`, async () => {
    const copyKey = 'test';
    const copyText = 'Hello, World!';
    const content = html`
    <really-clipboard-copy>
      <div copy-id="${copyKey}">${copyText}</div>
      <button copy-for="${copyKey}">Copy</button>
    </really-clipboard-copy>
    `;
    const el = await fixture<ReallyClipboardCopy>(content);

    /**
     * NOTE: Some browsers prohibit user-generated event handler.
     * Here attempt to test for 2 different custom events and see if any of these fires.
     * As long as any of these fulfills, the tests should pass.
     */
    const eventFired = new Promise<[Error|null, string|null]>((resolve) => {
      const copyTimer = window.setTimeout(() => resolve([new Error('timeout'), null]), 3e3);

      el.addEventListener('copy-success', (ev) => {
        window.clearTimeout(copyTimer);
        resolve([null, ev.detail.value]);
      });
    });

    /** NOTE: Only native page click can copy content successfully */
    await pageClick(`button[copy-for]`);

    const [copyError, copyResult] = await eventFired;

    assert.isNull(copyError);
    assert.strictEqual(copyResult, copyText);
  });

  it(`fires copy-error when the copy fails`, async () => {
    // #region Mock document.execCommand(...)
    const originalExecCommand = document.execCommand;
    Object.assign(document, {
      execCommand() {
        return false;
      },
    });
    // #endregion

    const copyKey = 'test';
    const copyText = 'Hello, World!';
    const content = html`
    <really-clipboard-copy>
      <div copy-id="${copyKey}">${copyText}</div>
      <button copy-for="${copyKey}">Copy</button>
    </really-clipboard-copy>
    `;
    const el = await fixture<ReallyClipboardCopy>(content);

    const copyButtonEl = el.querySelector<HTMLButtonElement>('button[copy-for]');

    /**
     * NOTE: Some browsers prohibit user-generated event handler.
     * Here attempt to test for 2 different custom events and see if any of these fires.
     * As long as any of these fulfills, the tests should pass.
     */
    const eventFired = new Promise<[Error|null, string|null]>((resolve) => {
      const copyTimer = window.setTimeout(() => resolve([new Error('timeout'), null]), 3e3);

      el.addEventListener('copy-error', (ev) => {
        window.clearTimeout(copyTimer);
        resolve([ev.detail.reason, null]);
      });
    });

    /** NOTE: Copy command does not work when calling .click() imperatively on some browsers */
    copyButtonEl?.click();

    const [copyError, copyResult] = await eventFired;

    assert.instanceOf(copyError, Error);
    /** NOTE: Timeout on FF */
    assert.isTrue(['Failed to copy', 'timeout'].some(n => n === copyError?.message));
    assert.isNull(copyResult);

    /** Restore document.execCommand(...) */
    Object.assign(document, { execCommand: originalExecCommand });
  });

});

import { assert, fixture, html } from '@open-wc/testing';
import type { TemplateResult } from 'lit-html';

import type { ReallyClipboardCopy } from '../clipboard-copy.js';
import '../clipboard-copy.js';

describe('misc', () => {
  it('does not have idSlot element', async () => {
    const copyKey = 'test';
    const content: TemplateResult = html`
      <really-clipboard-copy>
        <button copy-for="${copyKey}" class="copy-button">Copy</button>
      </really-clipboard-copy>
    `;
    const el = await fixture<ReallyClipboardCopy>(content);

    const copyButtonEl = el.querySelector<HTMLButtonElement>('.copy-button');

    const copyTask = new Promise<Error>((resolve) => {
      window.setTimeout(() => resolve(), 3e3);

      el.addEventListener('copy-error', (ev) => {
        resolve(ev.detail.reason);
      });
    });

    window.focus();
    copyButtonEl?.click();

    await el.updateComplete;
    const result = await copyTask;

    assert.instanceOf(result, Error);
    assert.strictEqual(result.message, `No element matches 'idSlot' is found`);
  });

  it('copies input value', async () => {
    const copyKey = 'test';
    const copyText = 'Hello, World!';
    const content: TemplateResult = html`
      <really-clipboard-copy>
        <input copy-id="${copyKey}" value="${copyText}">
        <button copy-for="${copyKey}" class="copy-button">Copy</button>
      </really-clipboard-copy>
    `;
    const el = await fixture<ReallyClipboardCopy>(content);

    const copyButtonEl = el.querySelector<HTMLButtonElement>('.copy-button');

    const copyTask = new Promise<Error | string>((resolve) => {
      window.setTimeout(() => resolve(), 3e3);

      el.addEventListener('copy-error', (ev) => {
        resolve(ev.detail.reason);
      });
      el.addEventListener('copy-success', (ev) => {
        resolve(ev.detail.value);
      });
    });

    window.focus();
    copyButtonEl?.click();

    await el.updateComplete;
    const result = await copyTask;

    if (result instanceof Error) {
      assert.instanceOf(result, Error);
      assert.strictEqual(result.message, `Failed to copy`);
    } else {
      assert.strictEqual(result, copyText);
    }
  });

  it('copies textarea value', async () => {
    const copyKey = 'test';
    const copyText = 'Hello, World!';
    const content: TemplateResult = html`
      <really-clipboard-copy>
        <textarea copy-id="${copyKey}" value="${copyText}"></textarea>
        <button copy-for="${copyKey}" class="copy-button">Copy</button>
      </really-clipboard-copy>
    `;
    const el = await fixture<ReallyClipboardCopy>(content);

    const copyButtonEl = el.querySelector<HTMLButtonElement>('.copy-button');

    const copyTask = new Promise<Error | string>((resolve) => {
      window.setTimeout(() => resolve(), 3e3);

      el.addEventListener('copy-error', (ev) => {
        resolve(ev.detail.reason);
      });
      el.addEventListener('copy-success', (ev) => {
        resolve(ev.detail.value);
      });
    });

    window.focus();
    copyButtonEl?.click();

    await el.updateComplete;
    const result = await copyTask;

    if (result instanceof Error) {
      assert.instanceOf(result, Error);
      assert.strictEqual(result.message, `Failed to copy`);
    } else {
      assert.strictEqual(result, '');
    }
  });

  it('copies anchor value', async () => {
    const copyKey = 'test';
    const copyText = 'Hello, World!';
    const content: TemplateResult = html`
      <really-clipboard-copy>
        <a copy-id="${copyKey}" href="/#${copyText}">${copyText}</a>
        <button copy-for="${copyKey}" class="copy-button">Copy</button>
      </really-clipboard-copy>
    `;
    const el = await fixture<ReallyClipboardCopy>(content);

    const copyButtonEl = el.querySelector<HTMLButtonElement>('.copy-button');

    const copyTask = new Promise<Error | string>((resolve) => {
      window.setTimeout(() => resolve(), 3e3);

      el.addEventListener('copy-error', (ev) => {
        resolve(ev.detail.reason);
      });
      el.addEventListener('copy-success', (ev) => {
        resolve(ev.detail.value);
      });
    });

    window.focus();
    copyButtonEl?.click();

    await el.updateComplete;
    const result = await copyTask;

    if (result instanceof Error) {
      assert.instanceOf(result, Error);
      assert.strictEqual(result.message, `Failed to copy`);
    } else {
      const {
        pathname,
        hash,
      } = new URL(result);

      assert.strictEqual(`${pathname}${hash}`, '/#Hello,%20World!');
    }
  });

  it('fallbacks to empty string for copy content', async () => {
    const copyKey = 'test';
    const content: TemplateResult = html`
      <really-clipboard-copy>
        <div copy-id="${copyKey}"></div>
        <button copy-for="${copyKey}" class="copy-button">Copy</button>
      </really-clipboard-copy>
    `;
    const el = await fixture<ReallyClipboardCopy>(content);

    const copyButtonEl = el.querySelector<HTMLButtonElement>('.copy-button');

    const copyTask = new Promise<Error | string>((resolve) => {
      window.setTimeout(() => resolve(), 3e3);

      el.addEventListener('copy-error', (ev) => {
        resolve(ev.detail.reason);
      });
      el.addEventListener('copy-success', (ev) => {
        resolve(ev.detail.value);
      });
    });

    window.focus();
    copyButtonEl?.click();

    await el.updateComplete;
    const result = await copyTask;

    if (result instanceof Error) {
      assert.instanceOf(result, Error);
      assert.strictEqual(result.message, `Failed to copy`);
    } else {
      assert.strictEqual(result, '');
    }
  });

});

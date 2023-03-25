import '../../clipboard-copy/really-clipboard-copy.js';

import { assert, fixture, fixtureCleanup, html } from '@open-wc/testing';
import type { TemplateResult } from 'lit';

import type { ReallyClipboardCopy } from '../../clipboard-copy/really-clipboard-copy.js';
import { pageClick } from '../wtr-helpers/page-click.js';

describe('misc', () => {
  it('does not have idSlot element', async () => {
    const copyKey = 'test';
    const content: TemplateResult = html`
      <really-clipboard-copy>
        <button copy-for="${copyKey}" class="copy-button">Copy</button>
      </really-clipboard-copy>
    `;
    const el = await fixture<ReallyClipboardCopy>(content);

    const copyTask = new Promise<Error>((resolve) => {
      const copyTimer = window.setTimeout(
        () => resolve(new Error('timeout')),
        3e3
      );

      el.addEventListener('copy-error', (ev) => {
        window.clearTimeout(copyTimer);
        resolve(ev.detail.reason);
      });
    });

    await pageClick('button[copy-for]');

    const result = await copyTask;

    assert.instanceOf(result, Error);
    assert.strictEqual(result.message, `No element matches 'idSlot' is found`);
  });

  it('copies value', async () => {
    type A = [Error | null, string | null];

    const copyKey = 'test';
    const copyText = 'Hello, World!';
    const testCases: [() => TemplateResult, A][] = [
      [
        () => html`<input copy-id="${copyKey}" value="${copyText}">`,
        [null, copyText],
      ],
      [
        () =>
          html`<textarea copy-id="${copyKey}" .value="${copyText}"></textarea>`,
        [null, copyText],
      ],
      [
        () =>
          html`<a copy-id="${copyKey}" href="/#${copyText}">${copyText}</a>`,
        [null, '/#Hello,%20World!'],
      ],
      [() => html`<div copy-id="${copyKey}"></div>`, [null, '']],
    ];

    const result: A[] = [];
    for (const [contentFn, [, expected]] of testCases) {
      const content: TemplateResult = html`
        <really-clipboard-copy>
          ${contentFn()}
          <button copy-for="${copyKey}" class="copy-button">Copy</button>
        </really-clipboard-copy>
      `;
      const el = await fixture<ReallyClipboardCopy>(content);

      const copyTask = new Promise<A>((resolve) => {
        const copyTimer = window.setTimeout(
          () => resolve([new Error('timeout'), null]),
          3e3
        );

        el.addEventListener('copy-error', (ev) => {
          window.clearTimeout(copyTimer);
          resolve([ev.detail.reason, null]);
        });
        el.addEventListener('copy-success', (ev) => {
          window.clearTimeout(copyTimer);
          resolve([null, ev.detail.value]);
        });
      });

      await el.updateComplete;
      await pageClick('button[copy-for]');

      const [copyError, copyResult] = await copyTask;
      const copyExpectedResult =
        copyResult && expected?.startsWith('/')
          ? `/${new URL(copyResult).hash}`
          : copyResult;

      result.push([copyError, copyExpectedResult]);

      fixtureCleanup();
    }

    /** FIXME(motss): Webkit fails to copy an empty content */
    assert.deepStrictEqual(
      result.slice(0, 3),
      testCases.slice(0, 3).map(([, expected]) => expected)
    );

    /** FIXME(motss): Temporary workaround to make tests pass for Webkit */
    const [webkitCopyError, webkitCopyResult] = result[3];
    if (webkitCopyError) {
      assert.instanceOf(webkitCopyError, Error);
      assert.deepStrictEqual(webkitCopyError?.message, 'Failed to copy');
      assert.isNull(webkitCopyResult);
    } else {
      assert.isNull(webkitCopyError);
      assert.deepStrictEqual(webkitCopyResult, '');
    }
  });
});

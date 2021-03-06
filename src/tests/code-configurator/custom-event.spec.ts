import { assert, expect, fixture, html } from '@open-wc/testing';
import type { TemplateResult } from 'lit-html';

import type { ReallyCodeConfigurator } from '../../code-configurator/really-code-configurator.js';
import '../../code-configurator/really-code-configurator.js';
import { pageClick } from '../wtr-helpers/page-click.js';
import { cssProperties, properties } from './properties.config.js';

describe('custom event', () => {
  it('fires content-copied when copying code snippet', async () => {
    type A = [Error | null, string | null];

    const content: TemplateResult = html`
    <really-code-configurator>
      <test-element></test-element>
    </really-code-configurator>
    `;
    const el = await fixture<ReallyCodeConfigurator>(content);
    const testElement = 'test-element';

    el.properties = properties;
    el.cssProperties = cssProperties;
    el.customElement = testElement;
    await el.updateComplete;

    const copyButtonSelectors = [
      '.copy-btn[for="propertiesFor"]',
      '.copy-btn[for="cssPropertiesFor"]',
    ];
    const copiedText = 'copied';
    for (const copyButtonSelector of copyButtonSelectors) {
      const eventFired = new Promise<A>((resolve) => {
        const copyTimer = window.setTimeout(() => resolve([new Error('timeout'), null]), 3e3);

        el.addEventListener('content-copied', () => {
          window.clearTimeout(copyTimer);
          resolve([null, copiedText]);
        });
      });

      await pageClick(copyButtonSelector);
      const [copyError, copyResult] = await eventFired;

      assert.isNull(copyError);
      assert.strictEqual(copyResult, copiedText);

      const copyButtonEl = el.shadowRoot?.querySelector<HTMLButtonElement>(copyButtonSelector);

      expect(copyButtonEl).lightDom.equal([
        '<span class="copy-text">',
        'Copied',
        '</span>',
      ].join(''));

      await new Promise(resolve => window.setTimeout(resolve, 3e3));

      expect(copyButtonEl).lightDom.equal([
        '<span class="copy-text">',
        'Copy',
        '</span>',
      ].join(''));
    }
  });

  it('does not fire content-copied when content is copied state', async () => {
    type A = [Error | null, string | null];

    const originalDocumentExecCommand = document.execCommand;
    let calls = 0;

    Object.assign(document, {
      execCommand() {
        calls += 1;
      },
    });

    const content: TemplateResult = html`
    <really-code-configurator>
      <test-element></test-element>
    </really-code-configurator>
    `;
    const el = await fixture<ReallyCodeConfigurator>(content);
    const testElement = 'test-element';

    el.properties = properties;
    el.cssProperties = cssProperties;
    el.customElement = testElement;
    await el.updateComplete;

    const copyButtonSelector = '.copy-btn[for="propertiesFor"]';
    const copiedText = 'copied';
    const eventFired = new Promise<A>((resolve) => {
      const copyTimer = window.setTimeout(() => resolve([new Error('timeout'), null]), 3e3);

      el.addEventListener('content-copied', () => {
        window.clearTimeout(copyTimer);
        resolve([null, copiedText]);
      });
    });

    await pageClick(copyButtonSelector);
    const [copyError, copyResult] = await eventFired;

    const copyButtonEl = el.shadowRoot?.querySelector<HTMLButtonElement>(copyButtonSelector);

    expect(copyButtonEl).lightDom.equal([
      '<span class="copy-text">',
      'Copied',
      '</span>',
    ].join(''));

    await pageClick(copyButtonSelector);
    await new Promise(resolve => window.setTimeout(resolve, 3e3));

    assert.isNull(copyError);
    assert.strictEqual(copyResult, copiedText);
    assert.strictEqual(calls, 1);

    expect(copyButtonEl).lightDom.equal([
      '<span class="copy-text">',
      'Copy',
      '</span>',
    ].join(''));

    Object.assign(document, { execCommand: originalDocumentExecCommand });
  });
});

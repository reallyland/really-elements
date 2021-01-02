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
});

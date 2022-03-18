import '../../code-configurator/really-code-configurator.js';

import { assert, expect, fixture, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import type { TemplateResult } from 'lit';

import type { ReallyCodeConfigurator } from '../../code-configurator/really-code-configurator.js';
import type { CodeConfiguratorCustomEventMap } from '../../code-configurator/types.js';
import { pageClick } from '../wtr-helpers/page-click.js';
import { pageFill } from '../wtr-helpers/page-fill.js';
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

  it('fires property-changed when input changes', async () => {
    type A = [
      error: Error | undefined,
      result: CodeConfiguratorCustomEventMap['property-changed']['detail'] | undefined
    ];

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

    for (const property of properties) {
      /**
       * NOTE(motss): Skip `select` element as `@input` does not fire as expected.
       */
      if (property.options?.length) continue;

      const propertySelector = `${property.options?.length ? 'select' : 'input'}[name="${property.name}"]`;
      const propertyElement = el.shadowRoot?.querySelector<
        | HTMLInputElement
        | HTMLSelectElement
      >(
        propertySelector
      );

      propertyElement?.focus();

      const eventFired = new Promise<A>((resolve) => {
        const propertyTimer = globalThis.setTimeout(
          () =>
            resolve([new Error('timeout'), undefined]), 3e3
        );

        el.addEventListener('property-changed', (e) => {
          globalThis.clearTimeout(propertyTimer);
          resolve([undefined, e.detail]);
        });
      });

      let expectedPropertyValue: unknown;

      switch (property.type) {
        case 'boolean': {
          await sendKeys({ press: ' ' });

          expectedPropertyValue = false;

          break;
        }
        case 'number': {
          await sendKeys({ press: 'ArrowUp' });

          expectedPropertyValue = 1;

          break;
        }
        case 'string': {
          if (property.options?.length) {
            // await sendKeys({ press: ' ' });
            // await sendKeys({ press: 'ArrowDown' });
            // await sendKeys({ press: 'Enter' });

            // expectedPropertyValue = '2';
          } else {
            await pageFill(propertySelector, 'a');

            expectedPropertyValue = 'a';
          }

          break;
        }
        default:
          // Do nothing
      }

      const [propertyError, propertyResult] = await eventFired;

      assert.isUndefined(propertyError);
      assert.strictEqual(propertyResult?.propertyValue, expectedPropertyValue);
    }
  });
});

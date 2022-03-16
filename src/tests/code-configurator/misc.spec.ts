import '../../code-configurator/really-code-configurator.js';

import { assert, fixture, html } from '@open-wc/testing';
import type { TemplateResult } from 'lit';

import type { ReallyCodeConfigurator } from '../../code-configurator/really-code-configurator.js';
import { getAssignedNodes } from '../helpers/get-assigned-nodes.js';
import { pageClick } from '../wtr-helpers/page-click.js';
import { pageFill } from '../wtr-helpers/page-fill.js';
import { cssProperties, properties } from './properties.config.js';

describe('misc', () => {
  it('renders with no matched custom element', async () => {
    const content: TemplateResult = html`
    <really-code-configurator>
      <test-element></test-element>
    </really-code-configurator>
    `;
    const el = await fixture<ReallyCodeConfigurator>(content);
    const testElement = 'test-element2';

    el.customElement = testElement;
    await el.updateComplete;

    assert.strictEqual(getAssignedNodes(el).length, 1);
  });

  it('updates code snippet when new value is selected for a property', async () => {
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

    const propertyBooleanSelector = 'input[type="checkbox"][name="propertyBoolean"]';
    const propertyBooleanEl = el.shadowRoot?.querySelector<HTMLInputElement>(
      propertyBooleanSelector
    );

    assert.isTrue(propertyBooleanEl?.checked);

    await pageClick(propertyBooleanSelector);

    assert.isFalse(propertyBooleanEl?.checked);
  });

  it('updates code snippet when new value is selected for a cssProperty', async () => {
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

    const testColor = 'yellow';
    const testElementColorSelector = 'input[name="--test-element-color"]';
    const testElementColorEl = el.shadowRoot?.querySelector<HTMLInputElement>(
      testElementColorSelector
    );

    assert.strictEqual(testElementColorEl?.value, 'green');

    await pageFill(testElementColorSelector, testColor);

    assert.strictEqual(testElementColorEl?.value, testColor);
  });

});

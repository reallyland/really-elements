import { assert, fixture, html } from '@open-wc/testing';
import type { TemplateResult } from 'lit-html';

import type { ReallyCodeConfigurator } from '../../code-configurator/really-code-configurator.js';
import '../../code-configurator/really-code-configurator.js';
import { pageClick } from '../wtr-helpers/page-click.js';
import { cssProperties, properties } from './properties.config.js';

describe('misc', () => {
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

    const propertyBooleanSelector = 'input[type="checkbox"][data-propertyname="propertyBoolean"]';
    const propertyBooleanEl = el.shadowRoot?.querySelector<HTMLInputElement>(
      propertyBooleanSelector
    );

    assert.isTrue(propertyBooleanEl?.checked);

    await pageClick(propertyBooleanSelector);

    assert.isFalse(propertyBooleanEl?.checked);
  });
});

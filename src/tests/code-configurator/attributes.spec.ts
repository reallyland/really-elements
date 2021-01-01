import { assert, fixture, html } from '@open-wc/testing';
import type { TemplateResult } from 'lit-html';

import type { ReallyCodeConfigurator } from '../../code-configurator/really-code-configurator.js';
import '../../code-configurator/really-code-configurator.js';
import { getAssignedNodes } from '../helpers/get-assigned-nodes.js';
import { cssProperties, properties } from './properties.config.js';

describe('attributes', () => {
  const hasPropertiesRendered = (node: HTMLElement) => {
    const h2Properties =
      node.shadowRoot?.querySelector<HTMLHeadingElement>('.all-properties-container h2.properties');
    return h2Properties != null;
  };
  const hasCssPropertiesRendered = (node: HTMLElement) => {
    const h2CssProperties =
      node.shadowRoot?.querySelector<HTMLHeadingElement>('.all-properties-container h2.css-properties');
    return h2CssProperties != null;
  };
  const hasCodeSnippetRendered = (node: HTMLElement) => {
    const $ = (e: string) => node.shadowRoot?.querySelector<HTMLElement>(e);
    const h2CodeSnippet = $('.all-code-snippets-container > h2');
    const h3Properties = $('.all-code-snippets-container > h3.properties');
    const h3CssProperties = $('.all-code-snippets-container > h3.css-properties');

    return h2CodeSnippet != null && h3Properties != null && h3CssProperties != null;
  };

  it(`renders with initial attributes`, async () => {
    const content: TemplateResult = html`
    <really-code-configurator></really-code-configurator>
    `;
    const el = await fixture<ReallyCodeConfigurator>(content);

    assert.isUndefined(el.properties);
    assert.isUndefined(el.cssProperties);
    assert.isUndefined(el.customElement);

    assert.isNull(el.getAttribute('properties'));
    assert.isNull(el.getAttribute('cssproperties'));
    assert.isNull(el.getAttribute('customelement'));
  });

  it(`renders with defined attributes`, async () => {
    const content: TemplateResult = html`
    <really-code-configurator></really-code-configurator>
    `;
    const el = await fixture<ReallyCodeConfigurator>(content);
    const testElement = 'test-element';

    el.setAttribute('properties', JSON.stringify(properties));
    el.setAttribute('cssproperties', JSON.stringify(cssProperties));
    el.setAttribute('customelement', testElement);

    await el.updateComplete;

    assert.deepStrictEqual(el.properties, properties);
    assert.deepStrictEqual(el.cssProperties, cssProperties);
    assert.deepStrictEqual(el.customElement, testElement);
    assert.deepStrictEqual(getAssignedNodes(el).length, 0);
    assert.isTrue(hasPropertiesRendered(el));
    assert.isTrue(hasCssPropertiesRendered(el));
    assert.isTrue(hasCodeSnippetRendered(el));
  });

});

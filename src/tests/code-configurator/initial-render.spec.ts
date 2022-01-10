import '../../code-configurator/really-code-configurator.js';

import { assert, fixture, html } from '@open-wc/testing';
import type { TemplateResult } from 'lit';

import type { ReallyCodeConfigurator } from '../../code-configurator/really-code-configurator.js';
import { getAssignedNodes } from '../helpers/get-assigned-nodes.js';
import { hasCodeSnippetRendered } from './helpers/has-code-snippet-rendered.js';
import { hasCssPropertiesRendered } from './helpers/has-css-properties-rendered.js';
import { hasPropertiesRendered } from './helpers/has-properties-rendered.js';
import { cssProperties, properties } from './properties.config.js';

describe('initial render', () => {
  it(`renders with initial properties and no contents`, async () => {
    const content: TemplateResult = html`
    <really-code-configurator></really-code-configurator>
    `;
    const el = await fixture<ReallyCodeConfigurator>(content);

    assert.isEmpty(el.properties);
    assert.isEmpty(el.cssProperties);
    assert.isUndefined(el.customElement);

    assert.deepStrictEqual(getAssignedNodes(el).length, 0);
    assert.isFalse(hasPropertiesRendered(el));
    assert.isFalse(hasCssPropertiesRendered(el));
    assert.isFalse(hasCodeSnippetRendered(el));
  });

  it(`renders with properties and contents`, async () => {
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

    assert.deepStrictEqual(el.properties, properties);
    assert.deepStrictEqual(el.cssProperties, cssProperties);
    assert.deepStrictEqual(el.customElement, testElement);
    assert.strictEqual(getAssignedNodes(el).length, 1);
    assert.isTrue(hasPropertiesRendered(el));
    assert.isTrue(hasCssPropertiesRendered(el));
    assert.isTrue(hasCodeSnippetRendered(el));
  });

  it(`renders with properties and nested contents`, async () => {
    const content: TemplateResult = html`
    <really-code-configurator>
      <div>
        <test-element></test-element>
      </div>
    </really-code-configurator>
    `;
    const el = await fixture<ReallyCodeConfigurator>(content);
    const testElement = 'test-element';

    el.properties = properties;
    el.cssProperties = cssProperties;
    el.customElement = testElement;
    await el.updateComplete;

    assert.deepStrictEqual(el.properties, properties);
    assert.deepStrictEqual(el.cssProperties, cssProperties);
    assert.deepStrictEqual(el.customElement, testElement);
    assert.strictEqual(getAssignedNodes(el).length, 1);
    assert.isTrue(hasPropertiesRendered(el));
    assert.isTrue(hasCssPropertiesRendered(el));
    assert.isTrue(hasCodeSnippetRendered(el));
  });

  it(`renders code snippets`, async () => {
    const content: TemplateResult = html`
    <really-code-configurator>
      <div>
        <test-element></test-element>
      </div>
    </really-code-configurator>
    `;
    const el = await fixture<ReallyCodeConfigurator>(content);
    const testElement = 'test-element';

    el.properties = properties;
    el.cssProperties = cssProperties;
    el.customElement = testElement;
    await el.updateComplete;

    const propertiesCodeSnippet = el.shadowRoot?.querySelector<HTMLPreElement>('.properties + .code-container > pre');
    const cssPropertiesCodeSnippet = el.shadowRoot?.querySelector<HTMLPreElement>('.css-properties + .code-container > pre');

    assert.strictEqual(propertiesCodeSnippet?.textContent, [
      '<test-element',
      '  propertystring="property"',
      '  propertynumber="0"',
      '  propertyboolean',
      '  propertywithselectableoptions="option-1"',
      '></test-element>',
    ].join('\n'));
    assert.strictEqual(cssPropertiesCodeSnippet?.textContent, [
      'test-element {',
      '  --test-element-width: 2px;',
      '  --test-element-height: 2px;',
      '  --test-element-color: green;',
      '  --test-element-background-color: red;',
      '}',
    ].join('\n'));
  });

});

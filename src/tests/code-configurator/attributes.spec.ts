import { assert, fixture, html } from '@open-wc/testing';
import type { TemplateResult } from 'lit-html';

import type { ReallyCodeConfigurator } from '../../code-configurator/really-code-configurator.js';
import '../../code-configurator/really-code-configurator.js';
import { getAssignedNodes } from '../helpers/get-assigned-nodes.js';
import { hasCodeSnippetRendered } from './helpers/has-code-snippet-rendered.js';
import { hasCssPropertiesRendered } from './helpers/has-css-properties-rendered.js';
import { hasPropertiesRendered } from './helpers/has-properties-rendered.js';
import { cssProperties, properties } from './properties.config.js';

describe('attributes', () => {
  it(`renders with initial attributes`, async () => {
    const content: TemplateResult = html`
    <really-code-configurator></really-code-configurator>
    `;
    const el = await fixture<ReallyCodeConfigurator>(content);

    assert.isEmpty(el.properties);
    assert.isEmpty(el.cssProperties);
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

  it(`renders no cssProperties container with no cssProperties`, async () => {
    const content: TemplateResult = html`
    <really-code-configurator></really-code-configurator>
    `;
    const el = await fixture<ReallyCodeConfigurator>(content);
    const testElement = 'test-element';
    const testCssProperties = '';

    el.setAttribute('cssproperties', testCssProperties);
    el.setAttribute('customelement', testElement);
    await el.updateComplete;

    assert.deepStrictEqual(el.cssProperties, []);
    assert.deepStrictEqual(el.customElement, testElement);
    assert.isFalse(hasCssPropertiesRendered(el));
  });

  it(`renders no properties container with no properties`, async () => {
    const content: TemplateResult = html`
    <really-code-configurator></really-code-configurator>
    `;
    const el = await fixture<ReallyCodeConfigurator>(content);
    const testElement = 'test-element';
    const testProperties = '';

    el.setAttribute('properties', testProperties);
    el.setAttribute('customelement', testElement);
    await el.updateComplete;

    assert.deepStrictEqual(el.properties, []);
    assert.deepStrictEqual(el.customElement, testElement);
    assert.isFalse(hasPropertiesRendered(el));
  });

});

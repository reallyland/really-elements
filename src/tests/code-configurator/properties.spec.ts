import '../../code-configurator/really-code-configurator.js';

import { assert, fixture, html } from '@open-wc/testing';
import type { TemplateResult } from 'lit';

import type { ReallyCodeConfigurator } from '../../code-configurator/really-code-configurator.js';
import { getAssignedNodes } from '../helpers/get-assigned-nodes.js';
import { hasCodeSnippetRendered } from './helpers/has-code-snippet-rendered.js';
import { hasCssPropertiesRendered } from './helpers/has-css-properties-rendered.js';
import { hasPropertiesRendered } from './helpers/has-properties-rendered.js';
import { cssProperties, properties } from './properties.config.js';

describe('properties', () => {
  it(`renders with initial properties`, async () => {
    const content: TemplateResult = html`
    <really-code-configurator></really-code-configurator>
    `;
    const el = await fixture<ReallyCodeConfigurator>(content);

    assert.isEmpty(el.properties);
    assert.isEmpty(el.cssProperties);
    assert.isUndefined(el.customElement);
  });

  it(`renders with defined properties`, async () => {
    const content: TemplateResult = html`
    <really-code-configurator></really-code-configurator>
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
    assert.deepStrictEqual(getAssignedNodes(el).length, 0);
    assert.isTrue(hasPropertiesRendered(el));
    assert.isTrue(hasCssPropertiesRendered(el));
    assert.isTrue(hasCodeSnippetRendered(el));
  });

  it(`renders no cssProperties container with invalid cssProperties`, async () => {
    const content: TemplateResult = html`
    <really-code-configurator></really-code-configurator>
    `;
    const el = await fixture<ReallyCodeConfigurator>(content);
    const testElement = 'test-element';
    const testCssProperties = null as never;

    el.cssProperties = testCssProperties;
    el.customElement = testElement;
    await el.updateComplete;

    assert.deepStrictEqual(el.cssProperties, []);
    assert.deepStrictEqual(el.customElement, testElement);
    assert.isFalse(hasCssPropertiesRendered(el));
  });

  it(`renders no properties container with invalid properties`, async () => {
    const content: TemplateResult = html`
    <really-code-configurator></really-code-configurator>
    `;
    const el = await fixture<ReallyCodeConfigurator>(content);
    const testElement = 'test-element';
    const testProperties = null as never;

    el.properties = testProperties;
    el.customElement = testElement;
    await el.updateComplete;

    assert.deepStrictEqual(el.properties, []);
    assert.deepStrictEqual(el.customElement, testElement);
    assert.isFalse(hasPropertiesRendered(el));
  });

});

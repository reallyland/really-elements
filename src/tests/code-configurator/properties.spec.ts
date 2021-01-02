import { assert, fixture, html } from '@open-wc/testing';
import type { TemplateResult } from 'lit-html';

import type { ReallyCodeConfigurator } from '../../code-configurator/really-code-configurator.js';
import '../../code-configurator/really-code-configurator.js';
import { getAssignedNodes } from '../helpers/get-assigned-nodes.js';
import { cssProperties, properties } from './properties.config.js';
import { hasPropertiesRendered } from './helpers/has-properties-rendered.js';
import { hasCssPropertiesRendered } from './helpers/has-css-properties-rendered.js';
import { hasCodeSnippetRendered } from './helpers/has-code-snippet-rendered.js';

describe('properties', () => {
  it(`renders with initial properties`, async () => {
    const content: TemplateResult = html`
    <really-code-configurator></really-code-configurator>
    `;
    const el = await fixture<ReallyCodeConfigurator>(content);

    assert.isUndefined(el.properties);
    assert.isUndefined(el.cssProperties);
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

  /** FIXME: Add tests for copy/ copied */

});

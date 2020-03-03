import type { ReallyCodeConfigurator } from '../code-configurator.js';

import { getTestName } from '../../test/test-helpers.js';
import '../code-configurator.js';
import { cssProperties, properties } from './properties.config.js';

const { strictEqual, deepStrictEqual, isTrue } = chai.assert;
let el: ReallyCodeConfigurator;

describe(getTestName('really-code-configurator'), () => {
  describe('properties', () => {
    const getAssignedNodes = (node: HTMLElement) => {
      const slotEl = node.shadowRoot!.querySelector('slot') as HTMLSlotElement;
      const assignedNodes = Array.from(slotEl.assignedNodes()).filter(
        n => n.nodeType === Node.ELEMENT_NODE);

      return assignedNodes;
    };
    const hasPropertiesRendered = (node: HTMLElement) => {
      const h2Properties =
        node.shadowRoot!.querySelector('.all-properties-container h2.properties');
      return h2Properties != null;
    };
    const hasCssPropertiesRendered = (node: HTMLElement) => {
      const h2CssProperties =
        node.shadowRoot!.querySelector('.all-properties-container h2.css-properties');
      return h2CssProperties != null;
    };
    const hasCodeSnippetRendered = (node: HTMLElement) => {
      const $ = (e: string) => node.shadowRoot!.querySelector(e);
      const h2CodeSnippet = $('.all-code-snippets-container > h2');
      const h3Properties = $('.all-code-snippets-container > h3.properties');
      const h3CssProperties = $('.all-code-snippets-container > h3.css-properties');

      return h2CodeSnippet != null && h3Properties != null && h3CssProperties != null;
    };

    beforeEach(async () => {
      el = document.createElement('really-code-configurator') as ReallyCodeConfigurator;
      document.body.appendChild(el);

      await el.updateComplete;
    });

    afterEach(() => {
      document.body.removeChild(el);
    });

    it(`renders with initial properties`, () => {
      strictEqual(el.properties, void 0, `'properties' not matched`);
      strictEqual(el.cssProperties, void 0, `'cssProperties' not matched`);
      strictEqual(el.customElement, void 0, `'customElement' not matched`);
    });

    it(`renders with properties set`, async () => {
      el.properties = properties;
      el.cssProperties = cssProperties;
      el.customElement = 'test-property';
      await el.updateComplete;

      const clonedProperties = JSON.parse(JSON.stringify(properties));
      const clonedCssProperties = JSON.parse(JSON.stringify(cssProperties));
      const assignedNodes = getAssignedNodes(el);

      deepStrictEqual(
        el.properties, clonedProperties, `'properties' not deep strict equal`);
      deepStrictEqual(
        el.cssProperties, clonedCssProperties, `'cssProperties' not deep strict equal`);
      strictEqual(el.customElement, 'test-property', `'customElement' not matched`);
      strictEqual(assignedNodes.length, 0, `Expected no assigned nodes rendered`);
      isTrue(hasPropertiesRendered(el), `Properties container should render`);
      isTrue(hasCssPropertiesRendered(el), `CSS properties container should render`);
      isTrue(hasCodeSnippetRendered(el), `Code snippets container should render`);
    });

    /** FIXME: Add tests for copy/ copied */

  });

});

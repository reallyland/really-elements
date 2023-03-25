import '../code-configurator/really-code-configurator.js';
import '../clipboard-copy/really-clipboard-copy.js';

import type { TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { reallyCodeConfiguratorLocalName } from '../code-configurator/constants.js';
import type { PropertyValue } from '../code-configurator/types.js';

@customElement('demo-app')
export class DemoApp extends LitElement {
  protected override render(): TemplateResult {
    return html`
    <really-clipboard-copy>
      <div copy-id="test">Hello, World!</div>
      <button copy-for="test">Copy</button>
    </really-clipboard-copy>

    <really-code-configurator
      .cssProperties=${
        /** Testing purpose. This has no effect to the custom element. */
        [
          {
            name: '--test-color',
            value: '#000',
          },
        ] as PropertyValue[]
      }
      .customElement=${reallyCodeConfiguratorLocalName}
      .properties="${
        [
          {
            name: 'forSlot',
            value: 'copy-for',
            type: 'string',
          },
          {
            name: 'idSlot',
            value: 'copy-id',
            type: 'string',
          },
          {
            name: 'test-boolean',
            value: false,
            type: 'boolean',
          },
          {
            name: 'test-number',
            value: 0,
            type: 'number',
          },
          {
            name: 'test-options',
            value: '1',
            type: 'string',
            options: [
              {
                label: '1',
                value: '1',
              },
              {
                label: '2',
                value: '2',
              },
            ],
          },
        ] as PropertyValue[]
      }"
      @property-changed=${console.debug}
    >
      <really-clipboard-copy>
        <div copy-id="test">Hello, World!</div>
        <button copy-for="test">Copy</button>
      </really-clipboard-copy>
    </really-code-configurator>
    `;
  }
}

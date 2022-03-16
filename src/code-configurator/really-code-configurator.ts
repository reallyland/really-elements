import { customElement } from 'lit/decorators.js';

import { CodeConfigurator } from './code-configurator.js';
import { reallyCodeConfiguratorLocalName } from './constants.js';
import type { CodeConfiguratorCustomEventMap } from './types.js';

@customElement(reallyCodeConfiguratorLocalName)
export class ReallyCodeConfigurator extends CodeConfigurator {}

declare global {
  interface HTMLElementEventMap extends CodeConfiguratorCustomEventMap {}

  interface HTMLElementTagNameMap {
    [reallyCodeConfiguratorLocalName]: ReallyCodeConfigurator;
  }

  interface Window {
    Prism: typeof import('prismjs');
  }
}

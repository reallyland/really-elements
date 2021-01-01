
import '@material/mwc-button/mwc-button.js';
import { customElement } from 'lit-element';

import { CodeConfigurator, localName } from './code-configurator.js';

@customElement(localName)
export class ReallyCodeConfigurator extends CodeConfigurator {}

export type { PropertyValue, PropertyValueOptions } from './code-configurator.js';

declare global {
  interface Window {
    Prism: typeof import('prismjs');
  }

  interface HTMLElementTagNameMap {
    [localName]: ReallyCodeConfigurator;
  }
}

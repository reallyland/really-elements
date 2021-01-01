
import '@material/mwc-button/mwc-button.js';
import { customElement, LitElement } from 'lit-element';
import { localName } from './code-configurator.js';

@customElement(localName)
export class ReallyCodeConfigurator extends LitElement {}

export type { PropertyValue, PropertyValueOptions } from './code-configurator.js';

declare global {
  interface Window {
    Prism: typeof import('prismjs');
  }

  interface HTMLElementTagNameMap {
    [localName]: ReallyCodeConfigurator;
  }
}

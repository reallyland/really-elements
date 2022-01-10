
import '@material/mwc-button/mwc-button.js';

import { customElement } from 'lit/decorators.js';

import { CodeConfigurator } from './code-configurator.js';
import { localName } from './constants.js';

@customElement(localName)
export class ReallyCodeConfigurator extends CodeConfigurator {}

declare global {
  interface HTMLElementEventMap {
    'content-copied': CustomEvent<undefined>;
  }

  interface HTMLElementTagNameMap {
    [localName]: ReallyCodeConfigurator;
  }

  interface Window {
    Prism: typeof import('prismjs');
  }
}

import { customElement } from 'lit/decorators.js';

import { ClipboardCopy } from './clipboard-copy.js';
import { localName } from './constants.js';
import type { CopyError,CopySuccess } from './types.js';

@customElement(localName)
export class ReallyClipboardCopy extends ClipboardCopy {}

declare global {
  interface HTMLElementEventMap {
    'copy-success': CustomEvent<CopySuccess>;
    'copy-error': CustomEvent<CopyError>;
  }
  interface HTMLElementTagNameMap {
    [localName]: ReallyClipboardCopy;
  }
}

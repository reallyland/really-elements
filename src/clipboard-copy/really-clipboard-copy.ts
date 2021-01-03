import { customElement } from 'lit-element';

import { ClipboardCopy, localName } from './clipboard-copy.js';

@customElement(localName)
export class ReallyClipboardCopy extends ClipboardCopy {}

export type { CopyError, CopySuccess } from './clipboard-copy.js';

declare global {
  interface HTMLElementTagNameMap {
    [localName]: ReallyClipboardCopy;
  }
}

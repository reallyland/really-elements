interface Slotted {
  id: HTMLElement | null;
  for: HTMLElement | null;
}
export interface CopySuccess {
  value: string;
}
export interface CopyError {
  reason: Error;
}

import {
  css,
  html,
  LitElement,
  property,
  query,
} from 'lit-element';
import type { TemplateResult } from 'lit-element';

export const localName = 'really-clipboard-copy';

function toCopyNode(
  node: HTMLElement,
  contentValue: string,
  noTextNode = false
) {
  let preNode = node;

  if (noTextNode) {
    preNode = document.createElement('pre');
    preNode.textContent = contentValue;
    preNode.style.position = 'absolute';
    preNode.style.top = preNode.style.left = '200vh';
    preNode.style.opacity = '0';

    document.body.appendChild(preNode);
  }

  return { node: preNode, temporary: noTextNode };
}

export class ClipboardCopy extends LitElement {
  public static styles = [
    css`
    :host {
      display: block;
    }

    * {
      box-sizing: border-box;
    }
    `,
  ];

  @property({ type: String })
  public forSlot = 'copy-for';

  @property({ type: String })
  public idSlot = 'copy-id';

  // @property({ type: Boolean, reflect: true })
  // public sync: boolean = false;

  @query('slot')
  private _slot?: HTMLSlotElement;

  private _idElement: HTMLElement | null = null;

  protected render(): TemplateResult {
    return html`<slot @slotchange="${this._assignSlotted}"></slot>`;
  }

  private _assignSlotted() {
    const slot = this._slot;

    if (slot) {
      const forSlot = this.forSlot;
      const idSlot = this.idSlot;
      const nodes = slot.assignedNodes() as HTMLElement[];

      const slotted = nodes.reduce((p, n) => {
        if (
          (p.for && p.id) ||
          n.nodeType !== Node.ELEMENT_NODE
        ) return p;

        const isIdSlot = n.hasAttribute(idSlot);
        const isForSlot = n.hasAttribute(forSlot);
        const isIdSlotNull = p.id == null;
        const isForSlotNull = p.for == null;

        if (isIdSlot && isIdSlotNull) {
          p.id = n;
        } else if (isForSlot && isForSlotNull) {
          p.for = n;
        } else {
          const forElement = isForSlotNull ? n.querySelector<HTMLElement>(`[${forSlot}]`) : null;
          const idElement = isIdSlotNull ? n.querySelector<HTMLElement>(`[${idSlot}]`) : null;

          if (forElement) p.for = forElement;
          if (idElement) p.id = idElement;
        }

        return p;
      }, { id: null, for: null } as Slotted);
      const forSlotted = slotted.for;

      if (forSlotted) forSlotted.addEventListener('click', () => this._copyText());

      this._idElement = slotted.id;
    }
  }

  private async _copyText() {
    let copySuccess = false;
    let contentValue = '';

    try {
      const idElement = this._idElement;

      if (idElement == null) {
        throw new Error(`No element matches 'idSlot' is found`);
      }

      const isInputElement = idElement instanceof HTMLInputElement;
      const isTextareaElement = idElement instanceof HTMLTextAreaElement;
      const isAnchorElement = idElement instanceof HTMLAnchorElement;

      contentValue = (isInputElement || isTextareaElement ?
        (idElement as HTMLInputElement).value :
        (isAnchorElement ? (idElement as HTMLAnchorElement).href : idElement.textContent)) || '';

      /**
       * FIXME(motss): Temporarily disable Clipboard API due to incomplete implementation in
       * supported browsers as the permission prompt does not work as expected. Users have to
       * manually allow Clipboard API in browser setting which is not intuitive in terms of UX.
       */
      // if (!this.sync && 'clipboard' in navigator) {
      //   await navigator.clipboard.writeText(contentValue);
      //   copySuccess = true;
      //   return;
      // }

      const nodeObj = toCopyNode(
        idElement,
        contentValue,
        isInputElement || isTextareaElement || isAnchorElement);
      const copyNode = nodeObj.node;

      const selection = getSelection();
      const range = document.createRange();

      selection?.removeAllRanges();
      range.selectNodeContents(copyNode);
      selection?.addRange(range);

      /**
       * NOTE(motss): Even though `document.execCommand` has been documented to have widely
       * supported for ages but there is actually a catch when comes to actual support in
       * older browsers.
       *
       * In the early days, `document.execCommand` only supports a partial list of commands
       * defined in the specs and `copy` is unfortunately one of them.
       *
       * For in-depth implementation details of the `copy` command, visit https://bit.ly/2XxcXDF.
       */
      copySuccess = document.execCommand('copy');
      selection?.removeAllRanges();

      if (nodeObj.temporary) document.body.removeChild(copyNode);
      if (!copySuccess) throw new Error('Failed to copy');
    } catch (reason) {
      this.dispatchEvent(new CustomEvent<CopyError>('copy-error', {
        /**
         * NOTE(motss): On Firefox, `undefined` is returned when Clipboard API fails to copy.
         */
        detail: { reason },
        bubbles: true,
        composed: true,
      }));
    } finally {
      if (copySuccess) {
        this.dispatchEvent(new CustomEvent<CopySuccess>('copy-success', {
          detail: { value: contentValue },
          bubbles: true,
          composed: true,
        }));
      }
    }
  }

}

declare global {
  interface HTMLElementEventMap {
    'copy-success': CustomEvent<CopySuccess>;
    'copy-error': CustomEvent<CopyError>;
  }

}

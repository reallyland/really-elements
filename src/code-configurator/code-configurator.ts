export interface PropertyValueOptions {
  label: string;
  value: string;
}
export interface PropertyValue {
  name: string;
  value: unknown;
  options?: PropertyValueOptions[];
  type?: string;
}

import '@material/mwc-button/mwc-button.js';
import { css, customElement, html, LitElement, property } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { highlight, languages } from 'nodemod/dist/lib/prismjs.js';

import { nothing } from 'lit-html/lib/part.js';
import { contentCopied, contentCopy } from './icons.js';
import { prismVscode } from './styles.js';

const localName  = 'really-code-configurator';

function notArray(a?: unknown[]) {
  return !Array.isArray(a) || !a.length;
}

function toFunctionType(type?: string) {
  switch (type) {
    case 'boolean': return Boolean;
    case 'number': return Number;
    case 'string':
    default: return String;
  }
}

function toInputType(type?: string) {
  switch (type) {
    case 'boolean': return 'checkbox';
    case 'number': return 'number';
    case 'string':
    default: return 'text';
  }
}

function toPropertiesAttr(properties: PropertyValue[]) {
  const mapped = properties.map((n) => {
    const { name, type, value } = n;

    const fnType = toFunctionType(type);
    const val = fnType(value);

    return `  ${name.toLowerCase()}="${val}"`;
  });

  return `\n${mapped.join('  \n')}\n`;
}

function toCSSProperties(cssProperties: PropertyValue[]) {
  return cssProperties.map(n => `  ${n.name}: ${n.value};\n`).join('');
}

function renderCode(code: string, grammar: string, language: string) {
  return unsafeHTML(highlight(code, languages[grammar], language));
}

@customElement(localName)
export class ReallyCodeConfigurator extends LitElement {
  public static styles = [
    css`
    :host {
      display: block;
    }

    input,
    select {
      margin: 0;
    }

    * {
      box-sizing: border-box;
    }

    .all-properties-container {
      display: flex;
    }

    .configurator + .configurator {
      margin: 8px 0 0;
    }

    .code-container {
      position: relative;
    }

    .copy-btn {
      position: absolute;
      top: 8px;
      right: 8px;

      color: #fff;
      fill: #fff;
      z-index: 1;

      --mdc-theme-primary: #fff;
    }

    .copy-text {
      margin: 0 0 0 8px;
    }

    @media screen and (max-width: 820px) {
      .all-properties-container,
      .configurator > label,
      .all-code-snippets-container,
      .code-container {
        max-width: 100%;
        width: 100%;
      }

      .all-properties-container {
        flex-direction: column;
      }

      label > div,
      label > input,
      label > select {
        max-width: calc(50% - 8px);
        width: 100%;
      }
    }

    @media (prefers-color-scheme: dark) {
      label > input:not([type="checkbox"]),
      label > select {
        background-color: #000;
        color: #f5f5f5;
        border: 1px solid #000;
      }
    }
    `,
    prismVscode,
  ];

  @property({ type: Array })
  public properties?: PropertyValue[];

  @property({ type: Array })
  public cssProperties?: PropertyValue[];

  @property({ type: String })
  public customElement?: string;

  @property({ type: Boolean })
  private _propsCopied: boolean = false;

  @property({ type: Boolean })
  private _cssPropsCopied: boolean = false;

  private copiedDuration: number = 3e3;

  private _slottedElements?: HTMLElement[];

  private get _slot(): HTMLSlotElement | null {
    return this.shadowRoot!.querySelector('slot');
  }

  protected updated() {
    if (null == this.customElement) return;

    const slottedElements = this._slottedElements;
    if (null == slottedElements) return this._updateSlotted();

    if (notArray(slottedElements)) return;

    const properties = this.properties;
    const cssProperties = this.cssProperties;

    if (!notArray(properties)) {
      properties!.forEach((n) => {
        slottedElements!.forEach((o) => {
          (o as any)[n.name] = n.value;
        });
      });
    }

    if (!notArray(cssProperties)) {
      cssProperties!.forEach((n) => {
        slottedElements!.forEach((o) => {
          o.style.setProperty(n.name, n.value as string);
        });
      });
    }
  }

  protected render() {
    const elName = this.customElement;
    const properties = this.properties;
    const cssProperties = this.cssProperties;

    return html`
    <div>
      <slot class="slot" @slotchange=${this._updateSlotted}></slot>
    </div>

    <div>${this._renderProperties(elName!, properties, cssProperties)}</div>
    `;
  }

  private _updateSlotted() {
    const slotted = this._slot;
    const customElementName = this.customElement;

    if (slotted && (typeof customElementName === 'string' && customElementName.length > 0)) {
      const assignedNodes = Array.from(slotted.assignedNodes()).filter(
        n => n.nodeType === Node.ELEMENT_NODE) as LitElement[];
      const matchedCustomElements = assignedNodes.reduce<LitElement[]>((p, n) => {
        if (n.localName === customElementName) {
          p.push(n);
        } else if (n && n.querySelectorAll) {
          const allCustomElements = Array.from(n.querySelectorAll<LitElement>(customElementName));
          p.push(...allCustomElements);
        }

        return p;
      }, []);

      this._slottedElements = notArray(matchedCustomElements) ? [] : matchedCustomElements;

      /**
       * Call `.requestUpdate()` on all slotted `LitElement`s then call `.requestUpdate()` of
       * this element. This is to fix some of the slotted elements not being updated/ rendered
       * correctly.
       */
      const elementsUpdateComplete = matchedCustomElements.map((n) => {
        return n.updateComplete ?
          n.updateComplete.then(() => n.requestUpdate && n.requestUpdate()) :
          n;
      });

      Promise.all(elementsUpdateComplete).then(() => this.requestUpdate());
    }
  }

  private _renderProperties(
    elName: string,
    properties?: PropertyValue[],
    cssProperties?: PropertyValue[]
  ) {
    const noProperties = notArray(properties);
    const noCssProperties = notArray(cssProperties);

    // tslint:disable: max-line-length
    return html`
    <div class="all-properties-container">
    ${noProperties ? nothing : html`<div>
      <h2 class="properties">Properties</h2>
      <div class="configurator-container">${this._renderPropertiesConfigurator(properties)}</div>
    </div>`}

    <div style="flex: 1; min-width: 16px;"></div>

    ${noCssProperties ? nothing : html`<div>
      <h2 class="css-properties">CSS Properties</h2>
      <div class="configurator-container">${
        this._renderPropertiesConfigurator(cssProperties, true)}</div>
    </div>`}
    </div>

    <div class="all-code-snippets-container">
      ${noProperties && noCssProperties ? nothing : html`<h2>Code snippet</h2>`}

      ${noProperties ? nothing : html`
      <h3 class="properties">Properties</h3>
      <div class="code-container">
        <mwc-button class="copy-btn" for="propertiesFor" @click="${this._copyCode}">
          ${this._propsCopied ? contentCopied : contentCopy}
          <span class="copy-text">${this._propsCopied ? 'Copied' : 'Copy'}</span>
        </mwc-button>
        <pre class="language-html" id="propertiesFor">${
          renderCode(`<${elName}${
            toPropertiesAttr(properties!)}><${elName}>`, 'html', 'html')}</pre>
      </div>`}

      ${noCssProperties ? nothing : html`
      <h3 class="css-properties">CSS Properties</h3>
      <div class="code-container">
        <mwc-button class="copy-btn" for="cssPropertiesFor" @click="${this._copyCode}">
          ${this._cssPropsCopied ? contentCopied : contentCopy}
          <span class="copy-text">${this._cssPropsCopied ? 'Copied' : 'Copy'}</span>
        </mwc-button>
        <pre class="language-css" id="cssPropertiesFor">${
          renderCode(`${elName} {\n${toCSSProperties(cssProperties!)}}`, 'css', 'css')}</pre>
      </div>`}
    </div>
    `;
    // tslint:disable: max-line-length
  }

  private _renderPropertiesConfigurator(properties?: PropertyValue[], isCSS: boolean = false) {
    if (notArray(properties)) return '';

    const longestName = properties!.reduce((p, n) => n.name.length > p.length ? n.name : p, '');
    const longestNameLen = longestName.length;
    const content = properties!.map((n) => {
      const { name, options, type, value } = n;
      const element = options ?
        html`<select
          data-propertyname="${name}"
          selected="${value}"
          @change="${(ev: Event) => this._updateProps(ev, isCSS)}">${
          options.map(o => html`<option value="${o.value}">${o.label}</option>`)}</select>` :
        html`<input
          data-propertyname="${name}"
          type="${toInputType(type)}"
          value="${value}"
          @change="${(ev: Event) => this._updateProps(ev, isCSS)}"/>`;

      return html`<div class="configurator">
        <label>
          <div style="display: inline-block; width: calc(${
            longestNameLen}ch + 8px);">${name}</div>
          ${element}
        </label>
      </div>`;
    });

    return content;
  }

  private _updateProps(ev: Event, isCSS: boolean) {
    const currentTarget = ev.currentTarget as HTMLInputElement | HTMLSelectElement;
    const propertyName = currentTarget.getAttribute('data-propertyname');
    const properties = isCSS ? this.cssProperties : this.properties;
    const val = currentTarget.tagName === 'INPUT' && currentTarget.type === 'checkbox' ?
      (currentTarget as HTMLInputElement).checked :
      currentTarget.value;

    if (notArray(properties)) return;

    const updatedProperties = properties!.map((n) => {
      if (n.name === propertyName) {
        return { ...n, value: toFunctionType(n.type)(val) };
      }

      return n;
    });

    const propName = `${isCSS ? 'cssP' : 'p'}roperties` as 'properties' | 'cssProperties';

    this[propName] = updatedProperties;
    this.requestUpdate(propName);
  }

  private _copyCode(ev: Event) {
    if (this._copied) return;

    const currentTarget = ev.currentTarget as HTMLElement;
    const copyNode =
      this.shadowRoot!.querySelector(`#${currentTarget.getAttribute('for')}`) as HTMLElement;

    const selection = getSelection()!;
    const range = document.createRange();

    selection.removeAllRanges();
    range.selectNodeContents(copyNode);
    selection.addRange(range);

    document.execCommand('copy');
    selection.removeAllRanges();

    this.dispatchEvent(new CustomEvent('content-copied'));

    const attrFor = currentTarget.getAttribute('for');
    const copiedProp = 'propertiesFor' === attrFor ? '_propsCopied' : '_cssPropsCopied';
    this[copiedProp] = true;

    setTimeout(() => {
      this[copiedProp] = false;
    }, this.copiedDuration);
  }

}

declare global {
  interface Window {
    Prism: typeof import('prismjs');
  }

  interface HTMLElementTagNameMap {
    'really-code-configurator': ReallyCodeConfigurator;
  }

  interface HTMLElementEventMap {
    'content-copied': CustomEvent<undefined>;
  }
}

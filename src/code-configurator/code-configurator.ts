import '@material/mwc-button/mwc-button.js';

import { highlight, languages } from '@reallyland/esm';
import type { TemplateResult } from 'lit';
import { css, html, LitElement, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { parts } from './constants.js';
import { contentCopied, contentCopy } from './icons.js';
import { prismVscode } from './styles.js';
import type { PropertyValue } from './types.js';

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
  const mapped = properties.reduce<string[]>((p, n) => {
    const {
      name,
      type = 'string',
      value,
    } = n;

    const fnType = toFunctionType(type);
    const val = fnType(value);

    if ((type === 'string' && !val) || (type === 'boolean' && !val)) return p;

    const attrName = name.toLowerCase();

    p.push(type === 'boolean' ? attrName : `${attrName}="${val}"`);

    return p;
  }, []).filter(Boolean).join('\n  ');

  return mapped ? `\n  ${mapped}\n` : '';
}

function toCSSProperties(cssProperties: PropertyValue[]) {
  return cssProperties.reduce<string[]>((p, n) => {
    const { name, value } = n;

    if (!value) return p;

    p.push(`  ${name}: ${value};\n`);

    return p;
  }, []).join('');
}

function renderCode(code: string, grammar: string, language: string) {
  return unsafeHTML(highlight(code, languages[grammar], language));
}

export class CodeConfigurator extends LitElement {
  public static override styles = [
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

    /* .all-properties-container {
      display: flex;
    } */

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
    `,
    prismVscode,
  ];

  @property({
    type: Array,
    converter: {
      fromAttribute(value: string): PropertyValue[] {
        try {
          return JSON.parse(value);
        } catch {
          return [];
        }
      },
    },
  })
  public get cssProperties(): PropertyValue[] {
    return this._cssProperties;
  }
  public set cssProperties(properties: PropertyValue[]) {
    this._cssProperties = Array.isArray(properties) ? properties : this._cssProperties;
    this.requestUpdate('cssProperties');
  }

  @property({
    type: Array,
    converter: {
      fromAttribute(value: string) {
        try {
          return JSON.parse(value);
        } catch {
          return [];
        }
      },
    },
  })
  public get properties(): PropertyValue[] {
    return this._properties;
  }
  public set properties(properties: PropertyValue[]) {
    this._properties = Array.isArray(properties) ? properties : this._properties;
    this.requestUpdate('properties');
  }

  @property({ type: String })
  public customElement?: string;

  @property({ type: Boolean })
  private _propsCopied = false;

  @property({ type: Boolean })
  private _cssPropsCopied = false;

  private _cssProperties: PropertyValue[] = [];

  private copiedDuration = 3e3;

  private _properties: PropertyValue[] = [];

  private _slottedElements?: HTMLElement[];

  private get _slot(): HTMLSlotElement {
    return this.shadowRoot?.querySelector<HTMLSlotElement>('slot') as HTMLSlotElement;
  }

  protected override updated(): void {
    if (this.customElement) {
      const slottedElements = this._slottedElements;

      if (slottedElements) {
        const properties = this._properties;
        const cssProperties = this._cssProperties;

        properties.forEach((n) => {
          slottedElements.forEach((o) => {
            Object.assign(o, {
              [n.name]: n.value,
            });
          });
        });

        cssProperties.forEach((n) => {
          slottedElements.forEach((o) => {
            o.style.setProperty(n.name, n.value as string);
          });
        });
      } else this._updateSlotted();
    }
  }

  protected override render(): TemplateResult {
    const elName = this.customElement;
    const properties = this._properties;
    const cssProperties = this._cssProperties;

    return html`
    <div part="${parts.slot}">
      <slot class="slot" @slotchange=${this._updateSlotted}></slot>
    </div>

    <div part="${parts.content}">${elName ? this._renderProperties(elName, properties, cssProperties) : nothing}</div>
    `;
  }

  private async _updateSlotted() {
    const slotted = this._slot;
    const customElementName = this.customElement;

    if (slotted && (typeof customElementName === 'string' && customElementName.length > 0)) {
      const assignedNodes = Array.from(slotted.assignedNodes()).filter(
        n => n.nodeType === Node.ELEMENT_NODE) as LitElement[];
      const matchedCustomElements = assignedNodes.reduce<LitElement[]>((p, n) => {
        if (n.localName === customElementName) {
          p.push(n);
        } else if (n?.querySelectorAll) {
          const allCustomElements = Array.from(n.querySelectorAll<LitElement>(customElementName));
          p.push(...allCustomElements);
        }

        return p;
      }, []);
      const hasMatchedCustomElements = matchedCustomElements.length > 0;

      this._slottedElements = hasMatchedCustomElements ? matchedCustomElements : [];

      if (hasMatchedCustomElements) {
        /**
         * Call `.requestUpdate()` on all slotted `LitElement`s then call `.requestUpdate()` of
         * this element. This is to fix some of the slotted elements not being updated/ rendered
         * correctly.
         */
        const elementsUpdateComplete = matchedCustomElements.map(
          n => n?.updateComplete?.then(() => n?.requestUpdate())
        );

        await Promise.all(elementsUpdateComplete);
      }

      this.requestUpdate();
    }
  }

  private _renderProperties(
    elName: string,
    properties: PropertyValue[],
    cssProperties: PropertyValue[]
  ) {
    const propsContent = toPropertiesAttr(properties);
    const cssPropsContent = toCSSProperties(cssProperties);

    // tslint:disable: max-line-length
    return html`
    <div class="all-properties-container" part="${parts.allPropertiesConfigurator}">
    ${propsContent ? html`<div part="${parts.propertiesConfigurator}">
      <h2 class="properties">Properties</h2>
      <div class="configurator-container">${this._renderPropertiesConfigurator(properties)}</div>
    </div>` : nothing}

    ${cssPropsContent ? html`<div part="${parts.cssPropertiesConfigurator}">
      <h2 class="css-properties">CSS Properties</h2>
      <div class="configurator-container">${
        this._renderPropertiesConfigurator(cssProperties, true)}</div>
    </div>` : nothing}
    </div>

    <div class="all-code-snippets-container" part="${parts.allCodeSnippets}">
      ${propsContent && cssPropsContent ? html`<h2>Code snippet</h2>` : nothing}

      ${propsContent ? html`<div part="${parts.propertiesCodeSnippet}">
        <h3 class="properties">Properties</h3>
        <div class="code-container">
          <mwc-button class="copy-btn" for="propertiesFor" @click="${this._copyCode}">
            ${this._propsCopied ? contentCopied : contentCopy}
            <span class="copy-text">${this._propsCopied ? 'Copied' : 'Copy'}</span>
          </mwc-button>
          <pre class="language-html" id="propertiesFor">${
            renderCode(`<${elName}${propsContent}></${elName}>`, 'html', 'html')}</pre>
        </div>
      </div>` : nothing}

      ${cssPropsContent ? html`<div part="${parts.cssPropertiesCodeSnippet}">
        <h3 class="css-properties">CSS Properties</h3>
        <div class="code-container">
          <mwc-button class="copy-btn" for="cssPropertiesFor" @click="${this._copyCode}">
            ${this._cssPropsCopied ? contentCopied : contentCopy}
            <span class="copy-text">${this._cssPropsCopied ? 'Copied' : 'Copy'}</span>
          </mwc-button>
          <pre class="language-css" id="cssPropertiesFor">${
            renderCode(`${elName} {\n${cssPropsContent}}`, 'css', 'css')}</pre>
        </div>
      </div>` : nothing}
    </div>
    `;
    // tslint:disable: max-line-length
  }

  private _renderPropertiesConfigurator(properties: PropertyValue[], isCSS = false) {
    const longestName = properties.reduce((p, n) => n.name.length > p.length ? n.name : p, '');
    const longestNameLen = longestName.length;
    const content = properties.map((n) => {
      const { name, options, type, value } = n;
      const valueStr = value as string;
      const element = options ?
        html`<select
          part="${parts.select}"
          data-propertyname="${name}"
          .value="${valueStr}"
          @blur="${(ev: Event) => this._updateProps(ev, isCSS)}">${
          options.map(o => html`<option value="${o.value}" ?selected="${o.value === value}">${o.label}</option>`)
        }</select>` :
        html`<input
          part="${parts.input}"
          data-propertyname="${name}"
          type="${toInputType(type)}"
          value="${valueStr}"
          ?checked="${type === 'boolean' && Boolean(valueStr)}"
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
    const properties = isCSS ? this._cssProperties : this._properties;
    const val = currentTarget.tagName === 'INPUT' && currentTarget.type === 'checkbox' ?
      (currentTarget as HTMLInputElement).checked :
      currentTarget.value;

    const updatedProperties = properties.map((n) => {
      if (n.name === propertyName) {
        return { ...n, value: toFunctionType(n.type)(val) };
      }

      return n;
    });
    const propName = isCSS ? 'cssProperties' : 'properties';

    this[propName] = updatedProperties;
    this.requestUpdate(propName);
  }

  private _copyCode(ev: Event) {
    const currentTarget = ev.currentTarget as HTMLElement;
    const attrFor = currentTarget.getAttribute('for');
    const copiedProp = 'propertiesFor' === attrFor ? '_propsCopied' : '_cssPropsCopied';

    if (this[copiedProp]) return;

    const copyNode =
      this.shadowRoot?.querySelector<HTMLElement>(`#${currentTarget.getAttribute('for')}`) as HTMLElement;

    const selection = getSelection();
    const range = document.createRange();

    selection?.removeAllRanges();
    range.selectNodeContents(copyNode);
    selection?.addRange(range);

    document.execCommand('copy');
    selection?.removeAllRanges();

    this.dispatchEvent(new CustomEvent('content-copied'));
    this[copiedProp] = true;

    window.setTimeout(() => {
      this[copiedProp] = false;
    }, this.copiedDuration);
  }

}

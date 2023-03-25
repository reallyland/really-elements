import '@material/mwc-button';

import { highlight, languages } from '@reallyland/esm';
import type { TemplateResult } from 'lit';
import { html, LitElement, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { parts } from './constants.js';
import { contentCopied, contentCopy } from './icons.js';
import { codeConfigurationStyles, prismVscodeStyles } from './styles.js';
import type {
  CodeConfiguratorCustomEventPropertyChangeDetail,
  PropertyValue,
} from './types.js';

function toFunctionType(type?: string) {
  switch (type) {
    case 'boolean':
      return Boolean;
    case 'number':
      return Number;
    case 'string':
    default:
      return String;
  }
}

function toInputType(type?: string) {
  switch (type) {
    case 'boolean':
      return 'checkbox';
    case 'number':
      return 'number';
    case 'string':
    default:
      return 'text';
  }
}

function toPropertiesAttr(properties: PropertyValue[]) {
  const mapped = properties
    .reduce<string[]>((p, n) => {
      const { name, type = 'string', value } = n;

      const fnType = toFunctionType(type);
      const val = fnType(value);

      if ((type === 'string' && !val) || (type === 'boolean' && !val)) return p;

      const attrName = name.toLowerCase();

      p.push(type === 'boolean' ? attrName : `${attrName}="${String(val)}"`);

      return p;
    }, [])
    .filter(Boolean)
    .join('\n  ');

  return mapped ? `\n  ${mapped}\n` : '';
}

function toCSSProperties(cssProperties: PropertyValue[]) {
  return cssProperties
    .reduce<string[]>((p, n) => {
      const { name, value } = n;

      if (!value) return p;

      p.push(`  ${name}: ${value as string};\n`);

      return p;
    }, [])
    .join('');
}

function renderCode(code: string, grammar: string, language: string) {
  return unsafeHTML(highlight(code, languages[grammar], language));
}

export class CodeConfigurator extends LitElement {
  public static override styles = [codeConfigurationStyles, prismVscodeStyles];

  @property({
    type: Array,
    converter: {
      fromAttribute(value: string): PropertyValue[] {
        try {
          return JSON.parse(value) as PropertyValue[];
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
    this._cssProperties = Array.isArray(properties)
      ? properties
      : this._cssProperties;
    this.requestUpdate('cssProperties');
  }

  @property({
    type: Array,
    converter: {
      fromAttribute(value: string): PropertyValue[] {
        try {
          return JSON.parse(value) as PropertyValue[];
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
    this._properties = Array.isArray(properties)
      ? properties
      : this._properties;
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
    return this.shadowRoot?.querySelector<HTMLSlotElement>(
      'slot'
    ) as HTMLSlotElement;
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
      } else void this._updateSlotted();
    }
  }

  protected override render(): TemplateResult {
    const elName = this.customElement;
    const properties = this._properties;
    const cssProperties = this._cssProperties;

    return html`
    <div part=${parts.slot}>
      <slot
        @slotchange=${this._updateSlotted}
        class=slot
      ></slot>
    </div>

    <div part=${parts.content}>${
      elName
        ? this._renderProperties(elName, properties, cssProperties)
        : nothing
    }</div>
    `;
  }

  private async _updateSlotted() {
    const slotted = this._slot;
    const customElementName = this.customElement;

    if (
      slotted &&
      typeof customElementName === 'string' &&
      customElementName.length > 0
    ) {
      const assignedNodes = Array.from(slotted.assignedNodes()).filter(
        (n) => n.nodeType === Node.ELEMENT_NODE
      ) as LitElement[];
      const matchedCustomElements = assignedNodes.reduce<LitElement[]>(
        (p, n) => {
          if (n.localName === customElementName) {
            p.push(n);
          } else if (n?.querySelectorAll) {
            const allCustomElements = Array.from(
              n.querySelectorAll<LitElement>(customElementName)
            );
            p.push(...allCustomElements);
          }

          return p;
        },
        []
      );
      const hasMatchedCustomElements = matchedCustomElements.length > 0;

      this._slottedElements = hasMatchedCustomElements
        ? matchedCustomElements
        : [];

      if (hasMatchedCustomElements) {
        /**
         * Call `.requestUpdate()` on all slotted `LitElement`s then call `.requestUpdate()` of
         * this element. This is to fix some of the slotted elements not being updated/ rendered
         * correctly.
         */
        const elementsUpdateComplete = matchedCustomElements.map((n) =>
          n?.updateComplete?.then(() => n?.requestUpdate())
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

    const idPrefix = Math.random().toString(32).slice(-7);
    const cssPropertiesId = `cssPropertiesFor${idPrefix}`;
    const propertiesId = `propertiesFor${idPrefix}`;

    return html`
    <div class=all-properties-container part=${parts.allPropertiesConfigurator}>
    ${
      propsContent
        ? html`<section part=${parts.propertiesConfigurator}>
          <h2 class=properties>Properties</h2>
          <div class=configurators part=${
            parts.configurators
          }>${this._renderPropertiesConfigurator(properties)}</div>
        </section>`
        : nothing
    }

    ${
      cssPropsContent
        ? html`<section part=${parts.cssPropertiesConfigurator}>
        <h2 class=css-properties>CSS Properties</h2>
        <div class=configurators part=${
          parts.configurators
        }>${this._renderPropertiesConfigurator(cssProperties, true)}</div>
      </section>`
        : nothing
    }
    </div>

    <div class=all-code-snippets-container part=${parts.allCodeSnippets}>
      ${propsContent && cssPropsContent ? html`<h2>Code snippet</h2>` : nothing}

      ${
        propsContent
          ? html`<section part=${parts.propertiesCodeSnippet}>
        <h3 class=properties>Properties</h3>
        <div class=code-container>
          <mwc-button class=copy-btn for=${propertiesId} aria-label="Copy properties" @click=${
              this._copyCode
            }>
            ${this._propsCopied ? contentCopied : contentCopy}
            <span class=copy-text>${this._propsCopied ? 'Copied' : 'Copy'}</span>
          </mwc-button>
          <pre class=language-html id=${propertiesId}>${renderCode(
              `<${elName}${propsContent}></${elName}>`,
              'html',
              'html'
            )}</pre>
        </div>
      </section>`
          : nothing
      }

      ${
        cssPropsContent
          ? html`<section part=${parts.cssPropertiesCodeSnippet}>
        <h3 class=css-properties>CSS Properties</h3>
        <div class=code-container>
          <mwc-button class=copy-btn for=${cssPropertiesId} aria-label="Copy CSS properties" @click=${
              this._copyCode
            }>
            ${this._cssPropsCopied ? contentCopied : contentCopy}
            <span class=copy-text>${this._cssPropsCopied ? 'Copied' : 'Copy'}</span>
          </mwc-button>
          <pre class=language-css id=${cssPropertiesId}>${renderCode(
              `${elName} {\n${cssPropsContent}}`,
              'css',
              'css'
            )}</pre>
        </div>
      </section>`
          : nothing
      }
    </div>
    `;
  }

  private _renderPropertiesConfigurator(
    properties: PropertyValue[],
    isCSS = false
  ) {
    const content = properties.map((n) => {
      const { name, options, type, value } = n;
      const valueStr = value as string;
      const elementId = `${options ? 'select' : 'input'}_${type}_${name}`;

      const element = options
        ? html`<select
          .value=${valueStr}
          @input=${(ev: Event) => this._updateProps(ev, isCSS)}
          id=${elementId}
          name=${name}
          part=${parts.select}
        >${options.map(
          (o) =>
            html`<option value="${o.value}" ?selected="${o.value === value}">${
              o.label
            }</option>`
        )}</select>`
        : html`<input
          ?checked=${type === 'boolean' && Boolean(valueStr)}
          @input=${(ev: Event) => this._updateProps(ev, isCSS)}
          id=${elementId}
          name=${name}
          part=${parts.input}
          type=${toInputType(type)}
          value=${valueStr}
        />`;

      return html`<div class=configurator>
        <label for=${elementId}>${name}</label>
        ${element}
      </div>`;
    });

    return content;
  }

  private _updateProps(ev: Event, isCSS: boolean) {
    const currentTarget = ev.currentTarget as
      | HTMLInputElement
      | HTMLSelectElement;
    const propertyName = currentTarget.getAttribute('name') as string;
    const properties = isCSS ? this._cssProperties : this._properties;
    const val =
      currentTarget.tagName === 'INPUT' && currentTarget.type === 'checkbox'
        ? (currentTarget as HTMLInputElement).checked
        : currentTarget.value;

    const updatedProperties = properties.map((n) => {
      if (n.name === propertyName) {
        return { ...n, value: toFunctionType(n.type)(val) };
      }

      return n;
    });
    const propName = isCSS ? 'cssProperties' : 'properties';

    this[propName] = updatedProperties;
    this.requestUpdate(propName);
    this.dispatchEvent(
      new CustomEvent<CodeConfiguratorCustomEventPropertyChangeDetail>(
        'property-changed',
        {
          bubbles: true,
          detail: {
            eventFrom: ev.currentTarget as HTMLElement,
            isCSS,
            propertyName,
            propertyValue: toFunctionType(
              properties.find((n) => n.name === propertyName)?.type
            )(val),
          },
          composed: true,
        }
      )
    );
  }

  private _copyCode(ev: Event) {
    const currentTarget = ev.currentTarget as HTMLElement;
    const attrFor = currentTarget.getAttribute('for');
    const copiedProp = attrFor?.startsWith('propertiesFor')
      ? '_propsCopied'
      : '_cssPropsCopied';

    if (this[copiedProp]) return;

    const copyNode = this.shadowRoot?.querySelector<HTMLElement>(
      `#${attrFor}`
    ) as HTMLElement;

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

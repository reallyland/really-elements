interface ShadyCSS {
  nativeCss: boolean;
  nativeShadow: boolean;
  styleElement(host: Element, overrideProps?: {[key: string]: string}): void;
  prepareTemplateDom(template: Element, elementName: string): void;
  prepareTemplateStyles(
      template: Element, elementName: string, typeExtension?: string): void;
  getComputedStyleValue(template: Element, property: string): void;
}

interface ShadyDOM {
  inUse: boolean;
}

declare global {
  interface Window {
    ShadyCSS?: ShadyCSS;
    ShadyDOM?: ShadyDOM;
    ShadowRoot: new() => ShadowRoot;
  }
}

/** Allows code to check `instanceof ShadowRoot`. */
declare type ShadowRootConstructor = new() => ShadowRoot;
export declare const ShadowRoot: ShadowRootConstructor;

export const stripExpressionDelimiters = (html: string): string => html.replace(/<!---->/g, '');

export const nextFrame = (): Promise<void> => new Promise<void>(resolve => window.requestAnimationFrame(() => resolve()));

export const getComputedStyleValue = (element: Element, property: string): string | void =>
  window.ShadyCSS
    ? window.ShadyCSS.getComputedStyleValue(element, property)
    : window.getComputedStyle(element).getPropertyValue(property);

export const getShadowInnerHTML = (target: Element | HTMLElement): string => {
  const root = (target.shadowRoot || target);
  return root.innerHTML && stripExpressionDelimiters(root.innerHTML);
};

export const getTestName = (name: string): string => `${name}${new URL(window.location.href).search}`;

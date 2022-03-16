export interface CodeConfiguratorCustomEventMap {
  'content-copied': CustomEvent<undefined>;
  'property-changed': CustomEvent<CodeConfiguratorCustomEventPropertyChangeDetail>;
}

export interface CodeConfiguratorCustomEventPropertyChangeDetail {
  eventFrom: HTMLElement | null;
  isCSS: boolean;
  propertyName: string;
  propertyValue: string | number | boolean;
}

export interface PropertyValue {
  name: string;
  options?: PropertyValueOptions[];
  type?: 'boolean' | 'number' | 'string';
  value: unknown;
}

export interface PropertyValueOptions {
  label: string;
  value: string;
}

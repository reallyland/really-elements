export interface PropertyValue {
  name: string;
  value: unknown;
  options?: PropertyValueOptions[];
  type?: string;
}

export interface PropertyValueOptions {
  label: string;
  value: string;
}

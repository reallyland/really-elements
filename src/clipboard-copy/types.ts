export interface CopyError {
  reason: Error;
}

export interface CopySuccess {
  value: string;
}

export interface Slotted {
  id: HTMLElement | null;
  for: HTMLElement | null;
}

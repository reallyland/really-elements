import { executeServerCommand } from '@web/test-runner-commands';
import type { BrowserContext } from 'playwright';

export type BrowserPermissionName =
  | 'geolocation'
  | 'midi'
  | 'midi-sysex'
  | 'notifications'
  | 'push'
  | 'camera'
  | 'microphone'
  | 'background-sync'
  | 'ambient-light-sensor'
  | 'accelerometer'
  | 'gyroscope'
  | 'magnetometer'
  | 'accessibility-events'
  | 'clipboard-read'
  | 'clipboard-write'
  | 'payment-handler';

export type BrowserPermissionsOption = Parameters<
  BrowserContext['grantPermissions']
>[1];

export async function grantBrowserPermissions(
  permissions: BrowserPermissionName[],
  options?: BrowserPermissionsOption
): Promise<boolean> {
  return executeServerCommand('browser-permissions', { options, permissions });
}

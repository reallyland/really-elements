import { executeServerCommand } from '@web/test-runner-commands';
import type { Page } from 'playwright';

export async function pageFill(
  ...[selector, value, options]: Parameters<Page['fill']>
): Promise<void> {
  return executeServerCommand('page-fill', { options, selector, value });
}

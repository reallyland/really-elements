/**
 * This plugin is used to fill in the browser when running tests.
 *
 * Possible values are `Chromium`, `Firefox`, or `Webkit`.
 *
 * @returns {import('@web/test-runner').TestRunnerPlugin} Plugin definition
 */
export function pageFill() {
  const commandName = 'page-fill';

  return {
    name: commandName,
    async executeCommand({ command, payload, session }) {
      if (command !== commandName || session.browser.type !== 'playwright')
        return;

      const page = session.browser.getPage(session.id);
      const { options, selector, value } = payload ?? {};

      try {
        await page.fill(selector, value, options);
        return true;
      } catch {
        return false;
      }
    },
  };
}

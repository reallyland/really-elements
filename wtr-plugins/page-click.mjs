/**
 * This plugin is used to click in the browser when running tests.
 *
 * Possible values are `Chromium`, `Firefox`, or `Webkit`.
 *
 * @returns {import('@web/test-runner').TestRunnerPlugin} Plugin definition
 */
export function pageClick() {
  const commandName = 'page-click';

  return {
    name: commandName,
    async executeCommand({ command, payload, session }) {
      if (command !== commandName || session.browser.type !== 'playwright')
        return;

      const page = session.browser.getPage(session.id);
      const { options, selector } = payload ?? {};

      try {
        await page.click(selector, options);
        return true;
      } catch {
        return false;
      }
    },
  };
}

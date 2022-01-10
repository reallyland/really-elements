/**
 * This plugin grants permissions in the browser.
 *
 * @returns {import('@web/test-runner').TestRunnerPlugin} Plugin definition
 */
export function browserPermissions() {
  const commandName = 'browser-permissions';

  return {
    name: commandName,
    async executeCommand({ command, payload, session }) {
      if (command !== commandName || session.browser.type !== 'playwright') return;

      try {
        const {
          permissions,
          options,
        } = payload;

        const page = session.browser.getPage(session.id);
        const context = page.context();

        await context.grantPermissions(permissions, options);

        return true;
      } catch (error) {
        return false;
      }
    },
  };
}

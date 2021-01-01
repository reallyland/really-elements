import { esbuildPlugin } from '@web/dev-server-esbuild';
import { playwrightLauncher } from '@web/test-runner-playwright';

import { browserPermissions } from './wtr-plugins/browser-permissions.mjs';
import { pageClick } from './wtr-plugins/page-click.mjs';

const isCI = process.env.CI === true || process.env.CI === 'true';

/** @type {import('@web/test-runner').TestRunnerConfig} */
const config = {
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'firefox' }),
    playwrightLauncher({ product: 'webkit' }),
  ],
  browserStartTimeout: 60e3,
  concurrency: 3,
  concurrentBrowsers: 9,
  coverage: true,
  coverageConfig: {
    report: true,
    threshold: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    nativeInstrumentation: true,
    exclude: [
      './src/tests/**',
    ],
  },
  files: [
    // './src/tests/**/*.test.ts',

    './src/tests/clipboard-copy/attributes.spec.ts',
    './src/tests/clipboard-copy/custom-events.spec.ts',
    './src/tests/clipboard-copy/initial-render.spec.ts',
    './src/tests/clipboard-copy/properties.spec.ts',
    './src/tests/clipboard-copy/misc.spec.ts',
  ],
  nodeResolve: true,
  plugins: [
    esbuildPlugin({
      ts: true,
      target: 'firefox82', /** FF82 does not support private fields */
    }),
    browserPermissions(),
    pageClick(),
  ],
  testFramework: {
    config: {
      checkLeaks: true,
      fullTrace: true,
      timeout: 60e3,
      ui: 'bdd',
      ...(isCI && {
        retries: 3,
      }),
    }
  },
};

export default config;
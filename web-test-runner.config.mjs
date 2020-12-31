import { esbuildPlugin } from '@web/dev-server-esbuild';
import { playwrightLauncher } from '@web/test-runner-playwright';

import { browserPermissions } from './wtr-plugins/browser-permissions.mjs';

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
      './src/**/tests/**',
    ],
  },
  files: [
    // './src/tests/**/*.test.ts',

    './src/clipboard-copy/tests/attributes.spec.ts',
    './src/clipboard-copy/tests/custom-events.spec.ts',
    './src/clipboard-copy/tests/initial-render.spec.ts',
    './src/clipboard-copy/tests/properties.spec.ts',
  ],
  nodeResolve: true,
  plugins: [
    esbuildPlugin({
      ts: true,
      target: 'firefox82', /** FF82 does not support private fields */
    }),
    browserPermissions(),
  ],
  testFramework: {
    config: {
      checkLeaks: true,
      fullTrace: true,
      // retries: 3,
      timeout: 60e3,
      ui: 'bdd',
    }
  },
};

export default config;
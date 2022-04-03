import { nodeResolve } from '@rollup/plugin-node-resolve';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup';
import { playwrightLauncher } from '@web/test-runner-playwright';

import { browserPermissions } from './wtr-plugins/browser-permissions.mjs';
import { pageClick } from './wtr-plugins/page-click.mjs';
import { pageFill } from './wtr-plugins/page-fill.mjs';

const nodeResolvePlugin = fromRollup(nodeResolve);

const {
  CI = 'false',
  COVERAGE = 'false',
} = process.env;

const isCI = CI === 'true';
const isCoverage = COVERAGE === 'true';

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
  ...(
    isCoverage && ({
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
          './src/*tests*/**',
          'node_modules/**'
        ],
      },
    })
  ),
  files: [
    // './src/tests/**/*.test.ts',

    './src/tests/clipboard-copy/attributes.spec.ts',
    './src/tests/clipboard-copy/custom-events.spec.ts',
    './src/tests/clipboard-copy/initial-render.spec.ts',
    './src/tests/clipboard-copy/properties.spec.ts',
    './src/tests/clipboard-copy/misc.spec.ts',

    './src/tests/code-configurator/attributes.spec.ts',
    './src/tests/code-configurator/properties.spec.ts',
    './src/tests/code-configurator/initial-render.spec.ts',
    './src/tests/code-configurator/custom-event.spec.ts',
    './src/tests/code-configurator/misc.spec.ts',
  ],
  plugins: [
    nodeResolvePlugin({
      exportConditions: ['default', 'dev', 'development', 'esbuild', 'import'],
      extensions: ['.mjs', '.js', '.ts', '.css', '.graphql'],
    }),
    esbuildPlugin({ target: 'es2021', ts: true }),
    browserPermissions(),
    pageClick(),
    pageFill(),
  ],
  testFramework: {
    config: {
      // checkLeaks: true,
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

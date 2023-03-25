import '../../clipboard-copy/really-clipboard-copy.js';

import {
  assert,
  expect,
  fixture,
  fixtureCleanup,
  html,
} from '@open-wc/testing';
import type { TemplateResult } from 'lit';

import type { ReallyClipboardCopy } from '../../clipboard-copy/really-clipboard-copy.js';
import { getAssignedNodes } from '../helpers/get-assigned-nodes.js';

describe('initial render', () => {
  it(`renders with no nodes`, async () => {
    const content: TemplateResult = html`
      <really-clipboard-copy></really-clipboard-copy>
    `;
    const el = await fixture<ReallyClipboardCopy>(content);

    assert.strictEqual(el.innerHTML, '');
    assert.strictEqual(getAssignedNodes(el).length, 0);
  });

  it(`renders with nodes (div + button) in light DOM`, async () => {
    const copyKey = 'test';
    const copyText = 'Hello, World!';
    const content: TemplateResult = html`
      <really-clipboard-copy>
        <div copy-id="${copyKey}">${copyText}</div>
        <button copy-for="${copyKey}">Copy</button>
      </really-clipboard-copy>
    `;
    const el = await fixture<ReallyClipboardCopy>(content);

    expect(el).lightDom.equal(
      [
        '<div copy-id="test">Hello, World!</div>',
        '<button copy-for="test">Copy</button>',
      ].join('')
    );
    assert.strictEqual(getAssignedNodes(el).length, 2);
  });

  it(`renders with nested nodes in light DOM`, async () => {
    const copyKey = 'test';
    const copyText = 'Hello, World!';
    const testCases: [() => TemplateResult, string, number][] = [
      [
        () => html`
        <div>
          <div copy-id="${copyKey}">${copyText}</div>
          <button copy-for="${copyKey}">Copy</button>
        </div>
        `,
        [
          '<div>',
          '<div copy-id="test">Hello, World!</div>',
          '<button copy-for="test">Copy</button>',
          '</div>',
        ].join(''),
        1,
      ],
      [
        () => html`
        <div>
          <div copy-id="${copyKey}">${copyText}</div>
        </div>
        <div>
          <button copy-for="${copyKey}">Copy</button>
        </div>
        `,
        [
          '<div>',
          '<div copy-id="test">Hello, World!</div>',
          '</div>',
          '<div>',
          '<button copy-for="test">Copy</button>',
          '</div>',
        ].join(''),
        2,
      ],
      [
        () => html`
        <div>
          <button copy-for="${copyKey}">Copy</button>
        </div>
        <div>
          <div copy-id="${copyKey}">${copyText}</div>
        </div>
        `,
        [
          '<div>',
          '<button copy-for="test">Copy</button>',
          '</div>',
          '<div>',
          '<div copy-id="test">Hello, World!</div>',
          '</div>',
        ].join(''),
        2,
      ],
    ];

    for (const [contentFn, expectedDom, assignedNodesLength] of testCases) {
      const content: TemplateResult = html`
        <really-clipboard-copy>${contentFn()}</really-clipboard-copy>
      `;
      const el = await fixture<ReallyClipboardCopy>(content);

      expect(el).lightDom.equal(expectedDom);
      assert.strictEqual(getAssignedNodes(el).length, assignedNodesLength);

      fixtureCleanup();
    }
  });

  // FIXME(motss): This is disabled for now
  // it.skip(`renders with 'sync' attribute`, async () => {
  //   const copyKey = 'test';
  //   const copyText = 'Hello, World!';
  //   const content: TemplateResult = html`
  //     <really-clipboard-copy>
  //       <div copy-id="${copyKey}">${copyText}</div>
  //       <button copy-for="${copyKey}">Copy</button>
  //     </really-clipboard-copy>
  //   `;
  //   const el = await fixture<ReallyClipboardCopy>(content);

  //   el.sync = true;

  //   expect(el).lightDom.equal([
  //     '<div copy-id="test">Hello, World!</div>',
  //     '<button copy-for="test">Copy</button>',
  //   ].join(''));
  //   assert.isTrue(el.hasAttribute('sync'));
  //   assert.strictEqual(getAssignedNodes(el).length, 2);
  // });
});

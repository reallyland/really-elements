import { assert, expect, fixture, html } from '@open-wc/testing';
import type { TemplateResult } from 'lit-html';

import type { ReallyClipboardCopy } from '../clipboard-copy.js';
import '../clipboard-copy.js';
import { getAssignedNodes } from './helpers/get-assigned-nodes.js';

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

    expect(el).lightDom.equal([
      '<div copy-id="test">Hello, World!</div>',
      '<button copy-for="test">Copy</button>',
    ].join(''));
    assert.strictEqual(getAssignedNodes(el).length, 2);
  });

  it(`renders with nested nodes (div + button) in light DOM`, async () => {
    const copyKey = 'test';
    const copyText = 'Hello, World!';
    const content: TemplateResult = html`
      <really-clipboard-copy>
        <div>
          <div copy-id="${copyKey}">${copyText}</div>
          <button copy-for="${copyKey}">Copy</button>
        </div>
      </really-clipboard-copy>
    `;
    const el = await fixture<ReallyClipboardCopy>(content);

    expect(el).lightDom.equal([
      '<div>',
      '<div copy-id="test">Hello, World!</div>',
      '<button copy-for="test">Copy</button>',
      '</div>',
    ].join(''));
    assert.strictEqual(getAssignedNodes(el).length, 1);
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

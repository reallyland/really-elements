import { assert, fixture, html } from '@open-wc/testing';

import type { ReallyClipboardCopy } from '../clipboard-copy.js';
import '../clipboard-copy.js';
import { getAssignedNodes } from './helpers/get-assigned-nodes.js';

describe('properties', () => {
  it('renders with initial properties', async () => {
    const el = await fixture<ReallyClipboardCopy>(
      html`<really-clipboard-copy></really-clipboard-copy>`
    );

    assert.strictEqual(el.forSlot, 'copy-for');
    assert.strictEqual(el.idSlot, 'copy-id');
    // assert.strictEqual(el.sync, false);

    assert.strictEqual(el.innerHTML, '');
    assert.lengthOf(getAssignedNodes(el), 0);
  });

  it('renders with defined properties', async () => {
    const el = await fixture<ReallyClipboardCopy>(
      html`<really-clipboard-copy></really-clipboard-copy>`
    );

    // el.sync = true;
    el.forSlot = 'for';
    el.idSlot = 'id';
    await el.updateComplete;

    assert.strictEqual(el.getAttribute('forslot'), null);
    assert.strictEqual(el.getAttribute('idslot'), null);
    assert.strictEqual(el.getAttribute('sync'), null);

    assert.strictEqual(el.forSlot, 'for');
    assert.strictEqual(el.idSlot, 'id');
    // assert.strictEqual(el.sync, true);

    assert.strictEqual(el.innerHTML, '');
    assert.lengthOf(getAssignedNodes(el), 0);
  });

});

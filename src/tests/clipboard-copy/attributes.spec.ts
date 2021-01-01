import { assert, fixture, html } from '@open-wc/testing';

import '../../clipboard-copy/really-clipboard-copy.js';
import type { ReallyClipboardCopy } from '../../clipboard-copy/really-clipboard-copy.js';
import { getAssignedNodes } from '../helpers/get-assigned-nodes.js';

describe('attributes', () => {
  it('renders with initial attributes', async () => {
    const el = await fixture<ReallyClipboardCopy>(
      html`<really-clipboard-copy></really-clipboard-copy>`
    );

    assert.strictEqual(el.getAttribute('forslot'), null);
    assert.strictEqual(el.getAttribute('idslot'), null);
    assert.strictEqual(el.getAttribute('sync'), null);

    assert.strictEqual(el.forSlot, 'copy-for');
    assert.strictEqual(el.idSlot, 'copy-id');
    // assert.strictEqual(el.sync, false);

    assert.strictEqual(el.innerHTML, '');
    assert.lengthOf(getAssignedNodes(el), 0);
  });

  it('renders with defined attributes', async () => {
    const el = await fixture<ReallyClipboardCopy>(
      html`<really-clipboard-copy
        sync
        idslot="id"
        forslot="for"
      ></really-clipboard-copy>`
    );

    assert.strictEqual(el.getAttribute('forslot'), 'for');
    assert.strictEqual(el.getAttribute('idslot'), 'id');
    assert.strictEqual(el.getAttribute('sync'), '');

    assert.strictEqual(el.forSlot, 'for');
    assert.strictEqual(el.idSlot, 'id');
    // assert.strictEqual(el.sync, true);

    assert.strictEqual(el.innerHTML, '');
    assert.lengthOf(getAssignedNodes(el), 0);
  });

});

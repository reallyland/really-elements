<div align="center" style="text-align: center;">
  <h1 style="border-bottom: none;">really-clipboard-copy</h1>

  <p>Copy content to clipboard</p>
</div>

<hr />

[![MIT License][mit-license-badge]][mit-license-url]

## Table of contents <!-- omit in toc -->

- [Usage](#usage)
- [API references](#api-references)
- [Demo](#demo)
- [License](#license)

## Usage

**index.html**

```html
<html>
  <head>
    <script type="module">
      import 'https://unpkg.com/@reallyland/really-elements@latest/dist/clipboard-copy/clipboard-copy.js?module';

      const syncCopyEl = document.body.querySelector('.sync-copy');

      syncCopyEl.addEventListener('copy-success', (ev) => {
        const { value } = ev.detail;
        console.log(`Copied value is ${value}`);
      });
      syncCopyEl.addEventListener('copy-error', (ev) => {
        const { reason } = ev.detail;
        console.error(reason);
      });
    </script>
  </head>

  <body>
    <h2>Copy input text only using document.execCommand('copy')</h2>
    <really-clipboard-copy class="sync-copy" sync>
      <input copy-id="copiable" type="text" readonly value="Hello, World!" />
      <button copy-for="copiable">Copy</button>
    </really-clipboard-copy>
  </body>
</html>
```

## API references

- [ReallyClipboardCopy]

## Demo

_Coming soon_

## License

[MIT License](https://motss.mit-license.org/) © Rong Sen Ng (motss)

<!-- References -->
[ReallyClipboardCopy]: ./API_REFERENCES.md#reallyclipboardcopy

<!-- Badges -->
[mit-license-badge]: https://flat.badgen.net/badge/license/MIT/blue

<!-- Links -->
[mit-license-url]: https://github.com/reallyland/really-elements/blob/master/LICENSE

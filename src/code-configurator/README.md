<div align="center" style="text-align: center;">
  <h1 style="border-bottom: none;">@reallyland/really-code-configurator</h1>

  <p>Configure and generate code snippet for custom element</p>
</div>

<hr />

[![MIT License][mit-license-badge]][mit-license-url]

> Better element for the web

## Table of contents <!-- omit in toc -->

- [Usage](#usage)
- [API Reference](#api-reference)
- [Demo](#demo)
- [License](#license)

## Usage

**properties.config.ts**

```ts
import { PropertyValue } from '@reallyland/really-code-configurator';

const properties: PropertyValue[] = [
  {
    name: 'propertyString',
    value: 'property',
    type: 'string',
  },
  {
    name: 'propertyNumber',
    value: 0,
    type: 'number',
  },
  {
    name: 'propertyBoolean',
    value: true,
    type: 'boolean',
  },
  {
    name: 'propertyWithSelectableOptions',
    value: 'option-1',
    type: 'string',
    options: [
      {
        label: 'option-1',
        value: 'option-1',
      },
      {
        label: 'option-2',
        value: 'option-2',
      },
      {
        label: 'option-3',
        value: 'option-3',
      },
    ],
  },
];

const cssProperties: PropertyValue[] = [
  {
    name: '--test-property-width',
    value: '2px',
  }
];

export { properties, cssProperties };
```

**index.html**

```html
<html>
  <head>
    <script type="module">
      import '/path/to/test-property.js';
      import '/path/to/@reallyland/really-elements/really-code-configurator/really-code-configurator.js';
      import { properties, cssProperties } from '/path/to/properties.config.js';

      const configuratorEl = document.createElement('.configurator');

      /** Load `properties` and `cssProperties` */
      if (configuratorEl) {
        configuratorEl.properties = properties;
        configuratorEl.cssProperties = cssProperties;
      }
    </script>
  </head>

  <body>
    <really-code-configurator class="configurator" customelement="test-property">
      <test-property></test-property>
    </really-code-configurator>
  </body>
</html>
```

## API Reference

- [ReallyCodeConfigurator][]

## Demo

_Coming soon_

## License

[MIT License](https://motss.mit-license.org/) © Rong Sen Ng (motss)

<!-- References -->
[typescript-url]: https://github.com/Microsoft/TypeScript
[java-url]: https://www.java.com/en/download
[nodejs-url]: https://nodejs.org
[npm-url]: https://www.npmjs.com
[node-releases-url]: https://nodejs.org/en/download/releases
[vscode-url]: https://code.visualstudio.com
[vscode-lit-html-url]: https://github.com/mjbvz/vscode-lit-html
[web-component-tester-url]: https://github.com/Polymer/tools/tree/master/packages/web-component-tester
[wre-url]: https://developers.google.com/search/docs/guides/rendering
[wre-2019-url]: https://www.deepcrawl.com/blog/news/what-version-of-chrome-is-google-actually-using-for-rendering
[ReallyCodeConfigurator]: /API_REFERENCES.md#reallycodeconfigurator

<!-- MDN -->
[array-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[boolean-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[function-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[map-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[number-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[object-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[promise-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[regexp-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
[set-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
[string-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String

<!-- Badges -->
[mit-license-badge]: https://flat.badgen.net/badge/license/MIT/blue

<!-- Links -->
[mit-license-url]: https://github.com/reallyland/really-elements/blob/master/LICENSE

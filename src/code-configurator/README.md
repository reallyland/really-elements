<div align="center" style="text-align: center;">
  <h1 style="border-bottom: none;">really-code-configurator</h1>

  <p>Configure and generate code snippet for custom element</p>
</div>

<hr />

[![MIT License][mit-license-badge]][mit-license-url]

## Table of contents <!-- omit in toc -->

- [Usage](#usage)
- [API Reference](#api-reference)
- [Demo](#demo)
- [License](#license)

## Usage

**properties.config.ts**

```ts
import { PropertyValue } from 'https://unpkg.com/@reallyland/really-elements@latest/dist/code-configurator/code-configurator.js?module';

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
      import { properties, cssProperties } from '/path/to/properties.config.js';
      import 'https://unpkg.com/@reallyland/really-elements@latest/dist/code-configurator/code-configurator.js?module';

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
[ReallyCodeConfigurator]: /API_REFERENCES.md#reallycodeconfigurator

<!-- Badges -->
[mit-license-badge]: https://flat.badgen.net/badge/license/MIT/blue

<!-- Links -->
[mit-license-url]: https://github.com/reallyland/really-elements/blob/master/LICENSE

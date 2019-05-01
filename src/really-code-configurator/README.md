<div align="center" style="text-align: center;">
  <h1 style="border-bottom: none;">@reallyland/really-code-configurator</h1>

  <p>Configure and generate code snippet for custom element</p>
</div>

<hr />

<a href="https://www.buymeacoffee.com/RLmMhgXFb" target="_blank" rel="noopener noreferrer"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 20px !important;width: auto !important;" ></a>
[![tippin.me][tippin-me-badge]][tippin-me-url]
[![Follow me][follow-me-badge]][follow-me-url]

[![Version][version-badge]][version-url]
[![lit-element][lit-element-version-badge]][lit-element-url]
[![Node version][node-version-badge]][node-version-url]
[![MIT License][mit-license-badge]][mit-license-url]

[![Downloads][downloads-badge]][downloads-url]
[![Total downloads][total-downloads-badge]][downloads-url]
[![Packagephobia][packagephobia-badge]][packagephobia-url]
[![Bundlephobia][bundlephobia-badge]][bundlephobia-url]

[![CircleCI][circleci-badge]][circleci-url]
[![Dependency Status][daviddm-badge]][daviddm-url]

[![codebeat badge][codebeat-badge]][codebeat-url]
[![Codacy Badge][codacy-badge]][codacy-url]
[![Code of Conduct][coc-badge]][coc-url]

> Better element for the web

## Table of contents <!-- omit in toc -->

- [Pre-requisites](#pre-requisites)
- [Installation](#installation)
- [Usage](#usage)
- [Browser compatibility](#browser-compatibility)
- [API references](#api-references)
- [Demo](#demo)
- [License](#license)

## Pre-requisites

- [Java 8][java-url] _(`web-component-tester` works without any issue with Java 8)_
- [Node.js][nodejs-url] >= 8.16.0
- [NPM][npm-url] >= 6.4.1 ([NPM][npm-url] comes with [Node.js][nodejs-url], no separate installation is required.)
- (Optional for non-[VS Code][vscode-url] users) [Syntax Highlighting for lit-html in VS Code][vscode-lit-html-url]
- [web-component-tester][web-component-tester-url] >= 6.9.2 (For running tests, it's recommended to install globally on your system due to its insanely huge install size by running `npm i -g web-component-tester`.)

## Installation

```sh
# Install via NPM
$ npm install @reallyland/really-code-configurator
```

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
      import '/path/to/@reallyland/really-code-configurator.js';
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

## Browser compatibility

`really-code-configurator` works in all major browsers (Chrome, Firefox, IE, Edge, Safari, and Opera).

[Heavily tested](/.circleci/config.yml) on the following browsers:

| Name | OS |
| --- | --- |
| Internet Explorer 11 | Windows 7 |
| Edge 13 | Windows 10 |
| Edge 17 | Windows 10 |
| Safari 9 | Mac OS X 10.11 |
| Safari 10.1 | Mac OS 10.12 |
| Chrome 41 ([WRE][wre-url]) | Linux |
| Chrome 69 ([WRE 2019][wre-2019-url]) | Windows 10 |
| Firefox 62 (w/o native Shadow DOM) | macOS Mojave (10.14) |
| Firefox 63 (native Shadow DOM support) | Windows 10 |

## API references

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
[lit-element-url]: https://github.com/Polymer/lit-element?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=motss/app-datepicker
[node-releases-url]: https://nodejs.org/en/download/releases
[vscode-url]: https://code.visualstudio.com
[vscode-lit-html-url]: https://github.com/mjbvz/vscode-lit-html
[web-component-tester-url]: https://github.com/Polymer/tools/tree/master/packages/web-component-tester
[wre-url]: https://developers.google.com/search/docs/guides/rendering
[wre-2019-url]: https://www.deepcrawl.com/blog/news/what-version-of-chrome-is-google-actually-using-for-rendering
[ReallyCodeConfigurator]: /api-references.md#reallycodeconfigurator

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
[tippin-me-badge]: https://badgen.net/badge/%E2%9A%A1%EF%B8%8Ftippin.me/@igarshmyb/F0918E
[follow-me-badge]: https://flat.badgen.net/twitter/follow/igarshmyb?icon=twitter

[version-badge]: https://flat.badgen.net/npm/v/@reallyland/really-code-configurator?icon=npm
[lit-element-version-badge]: https://flat.badgen.net/npm/v/lit-element/latest?icon=npm&label=lit-element
[node-version-badge]: https://flat.badgen.net/npm/node/@reallyland/really-code-configurator
[mit-license-badge]: https://flat.badgen.net/npm/license/@reallyland/really-code-configurator

[downloads-badge]: https://flat.badgen.net/npm/dm/@reallyland/really-code-configurator
[total-downloads-badge]: https://flat.badgen.net/npm/dt/@reallyland/really-code-configurator?label=total%20downloads
[packagephobia-badge]: https://flat.badgen.net/packagephobia/install/@reallyland/really-code-configurator
[bundlephobia-badge]: https://flat.badgen.net/bundlephobia/minzip/@reallyland/really-code-configurator

[circleci-badge]: https://flat.badgen.net/circleci/github/reallyland/really-code-configurator?icon=circleci
[daviddm-badge]: https://flat.badgen.net/david/dep/reallyland/really-code-configurator

[codebeat-badge]: https://codebeat.co/badges/886f771f-87f8-48a8-b0cf-9aa2edf30dc9
[codacy-badge]: https://api.codacy.com/project/badge/Grade/56c2dfca027d4b9c9d92e850d68e08eb
[coc-badge]: https://flat.badgen.net/badge/code%20of/conduct/pink

<!-- Links -->
[tippin-me-url]: https://tippin.me/@igarshmyb
[follow-me-url]: https://twitter.com/igarshmyb?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=@reallyland/really-code-configurator

[version-url]: https://www.npmjs.com/package/@reallyland/really-code-configurator/v/latest?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=@reallyland/really-code-configurator
[node-version-url]: https://nodejs.org/en/download?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=@reallyland/really-code-configurator
[mit-license-url]: https://github.com/reallyland/really-code-configurator/blob/master/LICENSE?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=@reallyland/really-code-configurator

[downloads-url]: https://www.npmtrends.com/@reallyland/really-code-configurator
[packagephobia-url]: https://packagephobia.now.sh/result?p=%40reallyland%2Freally-code-configurator
[bundlephobia-url]: https://bundlephobia.com/result?p=@reallyland/really-code-configurator

[circleci-url]: https://circleci.com/gh/reallyland/really-code-configurator/tree/master?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=@reallyland/really-code-configurator
[daviddm-url]: https://david-dm.org/reallyland/really-code-configurator?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=@reallyland/really-code-configurator

[codebeat-url]: https://codebeat.co/projects/github-com-reallyland-really-code-configurator-master-a97a5a48-afcd-4c3c-97d9-0909cfc2a5e1
[codacy-url]: https://www.codacy.com/app/reallyland/really-code-configurator?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=reallyland/really-code-configurator&amp;utm_campaign=Badge_Grade
[coc-url]: https://github.com/reallyland/really-code-configurator/blob/master/code-of-conduct.md

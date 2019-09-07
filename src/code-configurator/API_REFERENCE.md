# API References

## ReallyCodeConfigurator

### Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `properties` | [Array][]<[PropertyValue][]> | `undefined` | A list of configurable properties of a custom element. |
| `cssProperties` | [Array][]<[PropertyValue][]> | `undefined` | A list of configurable CSS Custom Properties of a custom properties. |
| `customElement` | [string][] | `undefined` | Name of custom element. It will be used for querying all custom elements. All properties will be applied to all custom elements found in the demo. |

### Types

#### PropertyValue

```ts
interface PropertyValueOptions {
  label: string;
  value: string;
}

interface PropertyValue {
  name: string;
  value: unknown;
  options?: PropertyValueOptions[];
  type?: string;
}
```

### Methods

_None_

### Events

_None_

### CSS Custom Properties

_None_

<!-- References -->
[PropertyValue]: /API_REFERENCE.md#propertyvalue

<!-- MDN -->
[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[Function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[Map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Regexp]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
[Set]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String

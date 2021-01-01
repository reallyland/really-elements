# API References

## CopySuccess

```ts
interface CopySuccess {
  value: string;
}
```

## CopyError 

```ts
interface CopyError {
  reason: Error;
}
```

## ReallyClipboardCopy

### Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `forSlot` | [string] | `copy-for` | The content of an element that has the `copy-for` attribute set will the copied to the clipboard. |
| `idSlot` | [string]| `copy-id` | The element that has the `copy-id` attribute set will trigger the copy function to copy the content of an element that has the `copy-for` attribute set. This usually is a clickable element such as the `<button>` element. |

<!-- | `sync` | [boolean] | `false` | If true, `document.execCommand('copy')` will be used instead of the native [Async Clipboard API] if supported. -->

### Methods

_None_

### Events

| Event | `detail` Type | Description |
| --- | --- | --- |
| `copy-success` | [CopySuccess] | Fires when the content of the element that has the `copy-for` attribute set is copied to the clipboard. |
| `copy-error` | [CopyError] | Fires when content fails to be copied to the clipboard. |

### CSS Custom Properties

_None_

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

<!-- References -->
[Async Clipboard API]: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
[CopySuccess]: #copysuccess
[CopyError]: #copyerror

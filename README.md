Ammer
====

**Ammer** is a proof of concept, building a DOM-event-wrapper with the powers of object-getters and the [`Proxy`](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Proxy)-object.

Therefore it does only work in Firefox and Microsoft Edge. **Please don't use it in production!**

The idea is to specify the event by calling a method, instead of passing the name as a string to a function.

## Installation

```bash
$ npm install --save ammer
```

## Usage

First you have to import the `ammer`-object.

```javascript
// ES2015 modules
import { ammer } from 'ammer';

// CommonJS modules
var ammer = require('ammer');

// AMD
require(['ammer'], function (ammer) { ... });

// Global variable
var ammer = window.ammer;
```

Then you have to create an instance. After that you can start binding and unbinding DOM-events.

```javascript
var amr = ammer.create();

// Binding a click-event
amr.on.click(document.body, function () {
    console.log('Clicked the body.');
});

// Unbinding all click-events
amr.off.click(document.body);
```

You can optionally pass the callback-function to the `off`-method, as well, to not remove all bindings for an event-type.

```javascript
var amr = ammer.create();

function onMouseEnter() {
    console.log('Mouse did enter ...');
}

// Bind to `mouseenter` ...
amr.on.mouseenter(document.querySelector('#hover-me'), onMouseEnter);

// ... and unbind again.
amr.off.mouseenter(document.querySelector('#hover-me'), onMouseEnter);
```

All other `mouseenter`-bindings to this element aren't affected.

## How does it work

The `on`- and `off`-methods of the `ammer`-object set the current mode (`addListener` or `removeListener`) and return a `Proxy`-instance, that handles all the `get`-calls. Thus it's possible to call all the event-name-methods, though they aren't explicitly defined.

## License

```
Beerware
```

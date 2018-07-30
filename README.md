# abbado

Conductor for concurrent async control flow. Simple way to stop all concurrent task-running flows without aborting currently running tasks. Also it's a good way to pause all flows at the same time from one place of code.

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

## Install

```bash
npm i abbado
```

## Usage

```js
const abbado = require('abbado');
const _ = abbado(options);
```

### methods:

* `stopped` - returns `false` if control flow is not stopped and stats object otherwise.
* `stop` - manually stop control flow (if not stopped yet) and reset pause (if paused). Optional parameter is a custom stats object or string for `status` field of stats object. Returns stats object.
* `pause` - set flows on pause (only parameter - pause length in ms).
* `resume` - alias for `pause(0)`.
* `wait` - waits for pause finish. Actually returns promise, that resolves after pause finished or immediately if there is no pause or if already stopped. If pause will be changed after waiting started, promise will wait for new pause length before resolve. If `stop` or `resume` will be called after waiting started, promise will resolve immediately.
* `error` - reports error. Optional parameter is string tag, describing kind of error. Returns array of two numbers: number of all reported errors and number of errors with same tag (or `null` if no tag).
* `paused` - feturns `true` or `false` whether control flow is paused or not.

### options:

* `timeout` - time in milliseconds time in milliseconds, after which control flow will be stopped.
* `count` - number limiting how many times `stopped` may return `false`.
* `errorLimit` - number limiting how many errors may be reported by `error` method before control flow will be stopped.
* `tagErrorLimit` - same as `errorLimit` but for any single tag.

### example:

```js
console.log(_.stopped()); //false
_.pause(1000);
_.wait()
    .then(doSomethingAfter1000ms)
    .then(() => _stop())
    .then(() => console.log(_.stopped())); //{status: 'stopped manually'}
```

## License

MIT

[npm-url]: https://npmjs.org/package/abbado
[npm-image]: https://badge.fury.io/js/abbado.svg
[travis-url]: https://travis-ci.org/astur/abbado
[travis-image]: https://travis-ci.org/astur/abbado.svg?branch=master
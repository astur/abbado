# abbado

Conductor for concurrent async control flow. Simple way to stop all concurrent task-running flows without aborting currently running tasks, or to pause all flows at the same time.

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

* `stopped` - returns `true` if control flow is stopped and `false` otherwise.
* `stop` - manually stop control flow.
* `pause` - set flows on pause (only parameter - pause length in ms).
* `wait` - waits for pause finish. Actually returns promise, that resolves after pause finished or immediately if there is no pause.

### options:

* `timeout` - time in milliseconds time in milliseconds, after which control flow will be stopped.
* `count` - number limiting how many times `stopped` may return `false`.

## License

MIT

[npm-url]: https://npmjs.org/package/abbado
[npm-image]: https://badge.fury.io/js/abbado.svg
[travis-url]: https://travis-ci.org/astur/abbado
[travis-image]: https://travis-ci.org/astur/abbado.svg?branch=master
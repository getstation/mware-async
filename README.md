# mware-async

`mware-async` is an extension to [`mware`](https://github.com/tur-nr/node-mware) but for an async/await style middleware stack.

[![Build Status](https://travis-ci.org/9technology/mware-async.svg?branch=master)](https://travis-ci.org/9technology/mware-async) [![Coverage Status](https://coveralls.io/repos/github/9technology/mware-async/badge.svg?branch=master)](https://coveralls.io/github/9technology/mware-async?branch=master)

### Usage

```js
import mware from 'mware-async';
const { use, run } = mware();

const context = {};

// add middleware
use(async (ctx, next) => {
    console.assert(ctx === context);
    console.log('a');
    await next();
    console.log('b');
});

use(async (ctx, next) => {
    console.log('c');
    await next();
});

// run stack
run(context).then(() => console.log('fin')); // a, c, b, fin
```

#### Errors

```js
// error middleware
use(async () => throw new Error('Bad stuff!'));

// run
run().catch(err => console.error(err)); // [Error: Bad stuff!]
```

## Installation

#### NPM

```
npm install --save mware-async
```

#### Yarn

```
yarn add mware-async
```

## API

##### `mware()`
Returns a `mware` instance.

#### Instance

##### `#use(fn...)`
* `fn: Function|[]Function`, Async middleware functions to add to stack.

##### `#run([...args])`
* `args: *`, Arguments to pass to each middleware function.

Returns a promise.

## License

[BSD-3-Clause](LICENSE)

Copyright (c) 2016 [9Technology](https://github.com/9technology)

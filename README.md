# mware-ts

[![Build Status](https://travis-ci.org/getstation/mware-ts.svg?branch=master)](https://travis-ci.org/getstation/mware-ts)

`mware-ts` is an extension to [`mware`](https://github.com/tur-nr/node-mware) but for Typescript, with an async/await style middleware stack.

### Usage

```typescript
import mware, { Event } from 'mware-ts';
const { use, run } = mware();

const e = new Event('test');

// add middleware
use(async (event, ...args) => {
    console.assert(e === event);
    console.log('a');
    return args;
});

use(async (event, arg1, arg2) => {
    console.log('b');
    return await Promise.resolve(
      [arg1, arg2 + 8]
    );
});

// run stack
run(e, 7, 5).then(() => console.log('fin')); // returns [e, [7, 13]]
```

#### Using Event

```typescript
import mware, { Event } from 'mware-ts';
const { use, run } = mware();

const e = new Event('my-event');

// add middleware
use(async (event, value) => {
    if (value === 'prevent') {
      event.preventDefault();
    }
    return value;
});

// run stack
run(e, 'continue').then(([e, value]) => console.log(e.isDefaultPrevented())); // false
run(e, 'prevent').then(([e, value]) => console.log(e.isDefaultPrevented())); // true

```

#### Errors

```typescript
import mware, { Event } from 'mware-ts';
const { use, run } = mware();

// error middleware
use(async () => { throw new Error('Bad stuff!') });

// run
run(new Event('test')).catch(err => console.error(err)); // [Error: Bad stuff!]
```

## Installation

#### NPM

```
npm install --save mware-ts
```

#### Yarn

```
yarn add mware-ts
```

## API

##### `mware()`
Returns a `mware` instance.

##### `Event`
Must be instanciated and passed as `#run` first parameter.

Usage: `new Event(string)`

Event objects have `preventDefault()` and `isDefaultPrevented()` methods.

#### Instance

##### `#use(fn: Function)`
* `fn: Function`, Async middleware functions to add to stack.

##### `#run(e: Event, ...args: any[])`
* `e: Event`, Instance of `Event` class.
* `args: *`, Arguments to pass to each middleware function.

Returns a promise.

## License

[BSD-3-Clause](LICENSE)

Copyright (c) 2016 [Station](https://github.com/getstation)

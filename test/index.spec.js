import test from 'ava';
import sinon from 'sinon';
import mware from '../src';

test('exports mware factory', t => {
    t.is(typeof mware, 'function');
});

test('has use method', t => {
    const m = mware();
    t.is(typeof m.use, 'function');
});

test('has run method', t => {
    const m = mware();
    t.is(typeof m.run, 'function');
});

test('runs with no middleware', async t => {
    await mware().run();
    t.pass();
});

test('calls added middleware', async t => {
    const m = mware();
    const fn = sinon.stub().yields();
    m.use(fn);
    await m.run();
    t.truthy(fn.calledWithMatch(
        sinon.match.func
    ));
});

test('adds array of middleware', async t => {
    const m = mware();
    const fn = sinon.stub().yields();
    m.use([fn, fn, fn]);
    await m.run();
    t.truthy(fn.calledThrice);
});

test('adds only functions as middleware', t => {
    const m = mware();
    const fn = sinon.stub().yields();
    m.use([fn, null, fn]);
    m.run([]);
    t.truthy(fn.calledTwice);
});

test('resolves after stack finished', async t => {
    const m = mware();
    m.use(async (next) => {
        await next();
        await new Promise((res) => setTimeout(res, 500));
    });
    m.use(async (next) => await next());
    await m.run();
    t.pass();
});

test('passes arguments to middleware', async t => {
    const m = mware();
    const fn = sinon.stub().yields();
    const object = {};
    m.use(fn);
    await m.run(object, true, 'foo');
    t.truthy(fn.calledWithMatch(
        sinon.match.same(object),
        sinon.match(true),
        sinon.match('foo'),
        sinon.match.func
    ));
});

test('rejects if error thrown', async t => {
    const m = mware();
    const fn = sinon.stub().throws();
    m.use(fn);
    try {
        await m.run();
        t.fail(); // reject thrown errors
    } catch (err) {
        t.pass();
    }
});

test('rejects if next() called multiple times', async t => {
    const m = mware();
    m.use(async (next) => {
        await next();
        await next(); // will throw
    });
    try {
        await m.run();
        t.fail(); // reject thrown errors
    } catch (err) {
        t.pass();
    }
});
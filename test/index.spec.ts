import test from 'ava';
import mware, { Event } from '../src';

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
  await mware().run(new Event('test'));
  t.pass();
});

test('calls added middleware', async t => {
  const m = mware();
  const fn1 = async (_e: Event, x: number, y: number, z: number) => [x + 1, y + 1, z + 1];
  const fn2 = (_e: Event, x: number, y: number, z: number) => x + y + z;
  const fn3 = () => {};
  m.use(fn1);
  const [, res1] = await m.run(new Event('test'), 1, 2, 3);
  t.deepEqual(res1, [2, 3, 4]);
  m.use(fn2);
  const [, res2] = await m.run(new Event('test'), 1, 2, 3);
  t.deepEqual(res2, 9);
  m.use(fn3);
  const [, res3] = await m.run(new Event('test'), 1, 2, 3);
  t.deepEqual(res3, 9);
});

test('rejects if error thrown', async t => {
  const m = mware();
  m.use(() => { throw new Error('yeah') });
  try {
    await m.run(new Event('test'));
    t.fail(); // reject thrown errors
  } catch (err) {
    t.pass();
  }
});

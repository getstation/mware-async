import * as BluebirdPromise from 'bluebird';

export type Middleware = (event: Event, ...args: any[]) => any;

export class Event {
  name: string;
  _isDefaultPrevented: boolean;

  constructor(name: string) {
    this.name = name;
    this._isDefaultPrevented = false;
  }

  public isDefaultPrevented() {
    return this._isDefaultPrevented;
  }

  public preventDefault() {
    this._isDefaultPrevented = true;
  }
}


export default () => {
  const stack: Middleware[] = [];

  const use = (fn: Middleware) => {
    stack.push(fn);
  };

  async function run<R = any>(event: Event, ...args: any[]): Promise<(Event | R)[]> {
    const res = await BluebirdPromise.reduce(stack, async (currentArgs, fn) => {
      let fnResult: any;
      if (!Array.isArray(currentArgs)) {
        fnResult = fn(event, currentArgs);
      } else {
        fnResult = fn(event, ...currentArgs);
      }
      const p = await BluebirdPromise.resolve(fnResult);
      if (p === undefined) return currentArgs;
      return p;
    }, args.length === 1 ? args[0] : args);
    return [event, res] as (Event | R)[];
  }

  return { use, run };
};

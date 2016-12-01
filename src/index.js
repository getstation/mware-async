import Promise from 'any-promise';

export default () => {
    const stack = [];

    const use = (...fns) => {
        fns.forEach((fn) => {
            if (Array.isArray(fn)) use(...fn);
            else if ('function' === typeof fn) stack.push(fn);
        });
    };

    const run = (...args) => {
        let i = -1;

        // same approach as koa-copose without the context
        // @see https://github.com/koajs/compose
        const next = (idx = 0) => {
            if (idx <= i) {
                return Promise.reject(new Error('next() already called'));
            }

            i = idx;
            let fn = stack[i];

            if (!fn) {
                return Promise.resolve();
            }

            try {
                return Promise.resolve(fn(...args, next.bind(null, i + 1)));
            } catch (err) {
                return Promise.reject(err);
            }
        }

        return next();
    };
    return { use, run };
};

import Promise from 'any-promise';

export default () => {
    const stack = [];

    const use = (...fns) => {
        let i = fns.length;
        while (i--) {
            const fn = fns[i];
            if (Array.isArray(fn)) return use(...fn);
            if ('function' === typeof fn) stack.push(fn);
        }
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

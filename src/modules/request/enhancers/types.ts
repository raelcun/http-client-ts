export type WrappedFn<F extends (...args: any) => any, R> = (wrappedFn: F) => (...args: Parameters<F>) => R

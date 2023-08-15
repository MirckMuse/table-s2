export * from './indexes'

export * from './cell';

export * from './header';

export function isObject(target: unknown) {
  return target && typeof target === 'object'
}

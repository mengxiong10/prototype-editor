import { isPlainObject } from 'lodash';

export function mergeObjectDeep<T extends Record<string, any>>(target: T, ...sources: any[]): T {
  if (sources.length === 0) {
    return target;
  }
  const [source, ...rest] = sources;

  if (!isPlainObject(target) || !isPlainObject(source)) {
    return source;
  }

  const newValue = { ...target };

  Object.keys(source).forEach((key: keyof T) => {
    newValue[key] = mergeObjectDeep(newValue[key], source[key]);
  });

  return mergeObjectDeep(newValue, ...rest);
}

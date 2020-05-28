export function isEqualArray(array1: any[], array2: any[]) {
  return (
    Array.isArray(array1) &&
    Array.isArray(array2) &&
    array1.length === array2.length &&
    array1.every((value, index) => value === array2[index])
  );
}

export type SingleOrArray<T> = T | T[];

export function transform2Array<T>(id: SingleOrArray<T>) {
  return Array.isArray(id) ? id : [id];
}

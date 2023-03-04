type DeepReadonlyCond<T> = T extends (infer R)[]
  ? DeepReadonlyArray<R>
  : T extends (...a: any[]) => any
  ? T
  : T extends object
  ? DeepReadonly<T>
  : T;

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonlyCond<T>> {}

export type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonlyCond<T[P]>;
};

export function deepFreeze<T>(object: T): DeepReadonly<T> {
  const obj = object as any;
  const propNames = Reflect.ownKeys(obj);

  for (const name of propNames) {
    const value = obj[name];
    if (value && typeof value === 'object') deepFreeze(value);
  }

  return Object.freeze(obj);
}

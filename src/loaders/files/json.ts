import { ConfigKeys } from 'loaders/base';

function recurseThroughObject(obj: Record<string, any>, path: string[] = []): ConfigKeys {
  const keys: ConfigKeys = [];
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value.constructor === Object) {
      const newKeys = recurseThroughObject(value, [...path, key]);
      keys.push(...newKeys);
    } else {
      keys.push({ key: path.concat(key).join('__'), value: value.toString() });
    }
  });
  return keys;
}

export function loadKeysFromObject(obj: any) {
  if (obj.constructor !== Object) throw new Error('Not an object'); // TODO proper error
  return recurseThroughObject(obj);
}

export function loadKeysFromJsonFileData(data: string): ConfigKeys {
  let obj: Record<string, any>;
  try {
    obj = JSON.parse(data);
  } catch {
    throw new Error('Cannot parse'); // TODO proper error
  }
  return loadKeysFromObject(obj);
}

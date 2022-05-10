import { configKeys } from 'loaders/base';

export function loadKeysFromEnvFileData(data: string): configKeys {
  // 1. get lines
  // 2. remove comments and trim whitespace
  // 3. remove empty lines
  // 4. retrieve key & value, error if no "=" found
  // 5. map to configKeys type
  return data
    .split(/\r?\n/g)
    .map((v) => v.split('#')[0].trim())
    .filter((v) => v.length)
    .map((v) => {
      const [key, ...rest] = v.split('=');
      if (rest.length == 0) throw new Error('Cannot parse'); // TODO proper error
      const value = rest.join('=');
      return [key, value];
    })
    .map((v) => ({
      key: v[0],
      value: v[1],
    }));
}

import { ConfigKeys } from 'loaders/base';

export function loadKeysFromEnvFileData(data: string, prefix?: string): ConfigKeys {
  // 1. get lines
  // 2. remove comments and trim whitespace
  // 3. remove empty lines
  // 4. retrieve key & value, error if no "=" found
  // 5. map to configKeys type

  let output = data
    .split(/\r?\n/g)
    .map((v) => v.split('#')[0].trim())
    .filter((v) => v.length)
    .map((v) => {
      const [key, ...rest] = v.split('=');
      if (rest.length === 0) throw new Error('Cannot parse'); // TODO proper error
      const value = rest.join('=');
      return [key, value];
    })
    .map((v) => ({
      key: v[0],
      value: v[1],
    }));

  // 6. filter out keys not starting with prefix
  // 7. strip prefixes
  if (prefix)
    output = output
      .filter((v) => v.key.startsWith(prefix))
      .map((v) => {
        v.key = v.key.slice(prefix.length);
        return v;
      });

  return output;
}

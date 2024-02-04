import { ConfigKeys } from 'loaders/base';
import { parse } from 'dotenv';

export function loadKeysFromEnvFileData(data: string, prefix?: string): ConfigKeys {
  const envObject = parse(data);
  let output = Object.entries(envObject).map(v=>({key: v[0], value: v[1] }));

  // filter out keys not starting with prefix AND strip prefixes
  if (prefix) {
    output = output
      .filter((v) => v.key.startsWith(prefix))
      .map((v) => {
        v.key = v.key.slice(prefix.length);
        return v;
      });
  }

  return output;
}

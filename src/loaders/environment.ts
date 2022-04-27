import { configKeys } from "loaders/base";

export interface environmentLoader {
  prefix: string;
}

export function loadFromEnvironment(loaders: environmentLoader[]): configKeys {
  const prefixes: string[] = loaders.map(v=>v.prefix);
  const keys: configKeys = [];
  Object.entries(process.env).forEach(v => {
    if (!v[1]) return;
    for (let prefix of prefixes) {
      if (v[0].startsWith(prefix))
        keys.push({
          key: v[0].slice(prefix.length),
          value: v[1],
        })
    }
  })
  return keys;
}

import { argv } from 'process';
import { configLoader } from 'builder/base';
import { configKeys } from 'loaders/base';

export interface CLILoader {
  prefix: string;
}

export function populateLoaderFromCLI(loader: configLoader, prefix: string) {
  loader.cli.push({
    prefix,
  });
}

export function getKeysFromCLI(loaders: CLILoader[]): configKeys {
  const prefixes: string[] = loaders.map((v) => v.prefix);
  const keys: configKeys = [];
  let findNext: { key: string }[] = [];
  argv.forEach((v) => {
    // if its waiting for next argument, parse that argument
    if (findNext.length > 0) {
      findNext.forEach((awaiting) => {
        keys.push({
          key: awaiting.key,
          value: v,
        });
      });
      findNext = [];
      return;
    }

    // arguments must start with --
    if (!v.startsWith('--')) return;

    // handle each prefix
    prefixes.forEach((prefix) => {
      // skip if prefix doesn't apply here
      if (!v.startsWith('--' + prefix)) return;
      const key = v.slice(2 + prefix.length);

      // "--KEY" "VALUE"
      if (!key.includes('=')) {
        findNext.push({
          key,
        });
        return;
      }

      // --KEY=VALUE
      const [argKey, ...rest] = key.split('=');
      const value = rest.join('=');
      keys.push({
        key: argKey,
        value: value,
      });
    });
  });

  // if still awaiting, its invalid arguments
  if (findNext.length > 0) {
    throw new Error('Invalid arguments'); // TODO better errors
  }

  return keys;
}
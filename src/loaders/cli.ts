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
  const findNext = {
    awaiting: false,
    key: '',
  };
  argv.forEach((v) => {
    // if its waiting for next argument, parse that argument
    if (findNext.awaiting) {
      keys.push({
        key: findNext.key,
        value: v,
      });
      findNext.awaiting = false;
      return;
    }

    // arguments must start with --
    if (!v.startsWith('--')) return;

    // find appropiate prefix or skip
    const prefix = prefixes.find((prefix) => v.startsWith('--' + prefix));
    if (!prefix) return;
    const key = v.slice(2 + prefix.length);

    // "--KEY" "VALUE"
    if (!key.includes('=')) {
      findNext.awaiting = true;
      findNext.key = key;
    }

    // --KEY=VALUE
    const [argKey, ...rest] = key.split('=');
    const value = rest.join('=');
    keys.push({
      key: argKey,
      value: value,
    });
  });

  // if still awaiting, invalid arguments
  if (findNext.awaiting) {
    throw new Error('Invalid arguments'); // TODO better errors
  }

  return keys;
}

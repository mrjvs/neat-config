import { configLoader } from 'builder/base';
import { configKeys } from 'loaders/base';

export interface dirOptions {
  prefix?: string;
}

export interface fullDirOptions extends dirOptions {
  path: string;
}

export interface dirLoader {
  prefix: string;
  path: string;
}

export function populateLoaderFromDir(loader: configLoader, ops: fullDirOptions) {
  const optionWithDefaults = {
    prefix: '',
    ...ops,
  };
  loader.dir.push(optionWithDefaults);
}

export function getKeysFromDir(loaders: dirLoader[]): configKeys {
  const keys: configKeys = [];
  return keys;
}

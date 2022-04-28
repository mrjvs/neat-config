import { readFileSync } from 'fs';
import { basename } from 'path';
import { configLoader } from 'builder/base';
import { configKeys } from 'loaders/base';
import { loadKeysFromJsonFileData } from './files/json';

export const ParserTypes = {
  JSON: 'JSON',
  ENV: 'ENV',
  FROM_EXT: 'FROM_EXT',
} as const;
export type ParserTypesType = keyof typeof ParserTypes;
const parserMap: Record<string, ParserTypesType> = {
  json: 'JSON',
  env: 'ENV',
} as const;

export const fileParsers: Record<ParserTypesType, (data: string) => configKeys> = {
  JSON: loadKeysFromJsonFileData,
  ENV: () => {
    throw new Error('Parser not implemented yet');
  }, // TODO implement
  FROM_EXT: () => {
    throw new Error('Cannot use FROM_EXT as a parsing type');
  }, // TODO proper error
};

export interface fileLoader {
  path: string;
  type: ParserTypesType;
}

function getExtension(path: string): string {
  const filename = basename(path);
  if (!filename) return '';
  const extensionIndex = filename.lastIndexOf('.');
  if (extensionIndex === -1) return '';
  let extension = filename.slice(extensionIndex + 1);
  return extension.toLowerCase();
}

export function populateLoaderFromFile(
  loader: configLoader,
  path: string,
  type: ParserTypesType = ParserTypes.FROM_EXT,
) {
  if (type === ParserTypes.FROM_EXT) {
    const extType = parserMap[getExtension(path)];
    if (!extType) throw new Error('invalid extension, cannot load file'); // TODO proper error
    type = extType;
  }
  if (!Object.values(ParserTypes).includes(type)) throw new Error('invalid parser type, cannot load file'); // TODO proper error
  loader.files.push({
    path,
    type,
  });
}

export function getKeysFromFiles(loaders: fileLoader[]): configKeys {
  const keys: configKeys = [];
  loaders.forEach((v) => {
    const data = readFileSync(v.path, { encoding: 'utf8' });
    const parser = fileParsers[v.type];
    keys.push(...parser(data));
  });
  return keys;
}

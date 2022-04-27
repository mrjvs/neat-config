import { configKeys } from "loaders/base";
import { environmentLoader, getKeysFromEnvironment } from "loaders/environment";
import { fileLoader, ParserTypesType } from "loaders/file";

export interface configLoader {
  environment: environmentLoader[],
  files: fileLoader[],
}

export interface configBuilder<T> {
  addFromEnvironment(prefix?: string): T;
  addFromFile(path: string, type?: ParserTypesType): T;
}

export function load(loaders: configLoader): configKeys {
  const keys: configKeys = [
    getKeysFromEnvironment(loaders.environment),
  ].flat();
  return keys;
}

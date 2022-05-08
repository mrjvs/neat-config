import { ObjectSchema } from 'joi';
import { configKeys } from 'loaders/base';
import { CLILoader } from 'loaders/cli';
import { environmentLoader, getKeysFromEnvironment } from 'loaders/environment';
import { fileLoader, ParserTypesType } from 'loaders/file';

export interface configLoader {
  environment: environmentLoader[];
  cli: CLILoader[];
  files: fileLoader[];
}

export interface configBuilder<Ret = any> {
  addFromEnvironment(prefix?: string): configBuilder<Ret>;
  addFromCLI(prefix?: string): configBuilder<Ret>;
  addFromFile(path: string, type?: ParserTypesType): configBuilder<Ret>;
  addJOISchema<Result>(joiSchema: ObjectSchema<Result>): configBuilder<Result>;
  load(): Ret;
}

export function loadLoaders(loaders: configLoader): configKeys {
  const keys: configKeys = [getKeysFromEnvironment(loaders.environment)].flat();
  return keys;
}

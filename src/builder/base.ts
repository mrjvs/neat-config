import { ObjectSchema } from 'joi';
import { configKeys } from 'loaders/base';
import { CLILoader } from 'loaders/cli';
import { dirLoader, dirOptions } from 'loaders/dir';
import { environmentLoader, getKeysFromEnvironment } from 'loaders/environment';
import { fileLoader, ParserTypesType } from 'loaders/file';
import { namingConventionFunc } from 'utils/translators/conventions';

export interface configLoader {
  environment: environmentLoader[];
  cli: CLILoader[];
  files: fileLoader[];
  dir: dirLoader[];
}

export interface configBuilder<Ret = any> {
  addFromEnvironment(prefix?: string): configBuilder<Ret>;
  addFromCLI(prefix?: string): configBuilder<Ret>;
  addFromDirectory(path: string, options?: dirOptions): configBuilder<Ret>;
  addFromFile(path: string, type?: ParserTypesType): configBuilder<Ret>;
  addJOISchema<Result>(joiSchema: ObjectSchema<Result>): configBuilder<Result>;
  setNamingConvention(convention: namingConventionFunc): configBuilder<Ret>;
  load(): Ret;
}

export function loadLoaders(loaders: configLoader): configKeys {
  const keys: configKeys = [getKeysFromEnvironment(loaders.environment)].flat();
  return keys;
}

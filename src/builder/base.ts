import { ConfigKeys } from 'loaders/base';
import { CLILoader, getKeysFromCLI } from 'loaders/cli';
import { DirLoader, DirOptions, getKeysFromDir } from 'loaders/dir';
import { EnvironmentLoader, getKeysFromEnvironment } from 'loaders/environment';
import { FileLoader, FileOptions, getKeysFromFiles, ParserTypesType } from 'loaders/file';
import { FragmentLoader } from 'loaders/fragment';
import { DeepReadonly } from 'utils/freeze';
import { NamingConventionFunc } from 'utils/translators/conventions';
import { AnyZodObject, TypeOf } from 'utils/zodTypes';
import { ObjectSchema } from 'utils/joiTypes';

export interface ConfigLoader {
  environment: EnvironmentLoader[];
  cli: CLILoader[];
  files: FileLoader[];
  dir: DirLoader[];
  fragments: FragmentLoader;
  freeze: boolean;
}

export interface ConfigBuilder<Ret = any> {
  // loaders
  addFromEnvironment(prefix?: string): ConfigBuilder<Ret>;
  addFromCLI(prefix?: string): ConfigBuilder<Ret>;
  addFromDirectory(path: string, options?: DirOptions): ConfigBuilder<Ret>;
  addFromFile(path: string, ops?: FileOptions): ConfigBuilder<Ret>;

  // schemas
  addJOISchema<Result>(joiSchema: ObjectSchema<Result>): ConfigBuilder<Result>;
  addZodSchema<T extends AnyZodObject>(zodSchema: T): ConfigBuilder<TypeOf<T>>;

  // fragments
  addConfigFragment(name: string, fragment: Record<string, any>): ConfigBuilder<Ret>;
  addConfigFragments(fragments: Record<string, Record<string, any>>): ConfigBuilder<Ret>;
  setFragmentKey(key: string): ConfigBuilder<Ret>;

  // other
  setNamingConvention(convention: NamingConventionFunc): ConfigBuilder<Ret>;
  freeze(): ConfigBuilder<DeepReadonly<Ret>>;
  load(): Ret;
}

export function loadLoaders(loaders: ConfigLoader): ConfigKeys {
  const keys: ConfigKeys = [
    getKeysFromEnvironment(loaders.environment),
    getKeysFromCLI(loaders.cli),
    getKeysFromFiles(loaders.files),
    getKeysFromDir(loaders.dir),
  ].flat();
  return keys;
}

import { configKeys } from "loaders/base";
import { environmentLoader, getKeysFromEnvironment } from "loaders/environment";
import { fileLoader, ParserTypesType } from "loaders/file";

export interface configLoader {
  environment: environmentLoader[],
  files: fileLoader[],
}

export interface configBuilder<Ret = any> {
  addFromEnvironment(prefix?: string): configBuilder<Ret>;
  addFromFile(path: string, type?: ParserTypesType): configBuilder<Ret>;
  addJsonSchema<JsonSchema>(schema: Record<string, any>): configBuilder<JsonSchema>;
  addClassSchema<ClassSchema>(schema: new () => ClassSchema): configBuilder<ClassSchema>;
  load(): Ret;
}

export function loadLoaders(loaders: configLoader): configKeys {
  const keys: configKeys = [
    getKeysFromEnvironment(loaders.environment),
  ].flat();
  return keys;
}

import { configBuilder, configLoader, loadLoaders } from 'builder/base';
import { ObjectSchema } from 'joi';
import { populateLoaderFromCLI } from 'loaders/cli';
import { dirOptions, populateLoaderFromDir } from 'loaders/dir';
import { populateLoaderFromEnvironment } from 'loaders/environment';
import { ParserTypes, ParserTypesType, populateLoaderFromFile } from 'loaders/file';
import { buildObjectFromKeys } from 'utils/build';
import { namingConventionFunc } from 'utils/translators/conventions';
import { useTranslatorMap } from 'utils/translators/map';
import { normalizeConfigKeys } from 'utils/translators/normalizer';
import {
  configSchema,
  configSchemaType,
  getTranslateMapFromSchema,
  validateObjectWithSchema,
  validateSchema,
} from './schema';

export function createConfigLoader(): configBuilder<any> {
  const loaders: configLoader = {
    environment: [],
    files: [],
    cli: [],
    dir: [],
  };
  let namingConvention: namingConventionFunc | null = null;
  let schema: configSchema | null = null;

  return {
    addFromEnvironment(prefix: string = '') {
      populateLoaderFromEnvironment(loaders, prefix);
      return this;
    },
    addFromDirectory(path: string, options: dirOptions = {}) {
      populateLoaderFromDir(loaders, { path, ...options });
      return this;
    },
    addFromCLI(prefix: string = '') {
      populateLoaderFromCLI(loaders, prefix);
      return this;
    },
    addFromFile(path: string, type: ParserTypesType = ParserTypes.FROM_EXT): configBuilder<any> {
      populateLoaderFromFile(loaders, path, type);
      return this;
    },
    addJOISchema<Result>(joiSchema: ObjectSchema<Result>): configBuilder<Result> {
      schema = {
        type: configSchemaType.JOI,
        schema: joiSchema,
      };
      validateSchema(schema);
      return this;
    },
    setNamingConvention(convention: namingConventionFunc) {
      namingConvention = convention;
      return this;
    },
    load(): any {
      // keys -> normalized keys -> translated keys -> schema transform + validate -> output object
      const keys = loadLoaders(loaders);
      const normalizedKeys = normalizeConfigKeys(keys);

      const translatorMap = getTranslateMapFromSchema(schema);
      const translatedKeys = useTranslatorMap(translatorMap, normalizedKeys, namingConvention);

      let output = buildObjectFromKeys(translatedKeys);
      output = validateObjectWithSchema(output, schema);

      return output;
    },
  };
}

import { configBuilder, configLoader, loadLoaders } from 'builder/base';
import { ObjectSchema } from 'joi';
import { populateLoaderFromCLI } from 'loaders/cli';
import { dirOptions, populateLoaderFromDir } from 'loaders/dir';
import { populateLoaderFromEnvironment } from 'loaders/environment';
import { ParserTypes, ParserTypesType, populateLoaderFromFile } from 'loaders/file';
import { expandFragments, extractFragmentDefinitionFromKeys } from 'loaders/fragment';
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
    fragments: {
      fragments: {},
      key: '',
    },
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
      // load and normalize keys
      const keys = loadLoaders(loaders);
      let normalizedKeys = normalizeConfigKeys(keys);

      // load fragments (and normalize their output)
      const fragmentOutput = extractFragmentDefinitionFromKeys(loaders.fragments, normalizedKeys);
      const fragmentKeys = expandFragments(loaders.fragments, fragmentOutput.fragments);
      normalizedKeys = normalizeConfigKeys(fragmentKeys).concat(fragmentOutput.keys);

      // translations
      const translatorMap = getTranslateMapFromSchema(schema);
      const translatedKeys = useTranslatorMap(translatorMap, normalizedKeys, namingConvention);

      // build output object and validation
      let output = buildObjectFromKeys(translatedKeys);
      output = validateObjectWithSchema(output, schema);
      return output;
    },
  };
}

import { ConfigBuilder, ConfigLoader, loadLoaders } from 'builder/base';
import { ObjectSchema } from 'joi';
import { populateLoaderFromCLI } from 'loaders/cli';
import { DirOptions, populateLoaderFromDir } from 'loaders/dir';
import { populateLoaderFromEnvironment } from 'loaders/environment';
import { ParserTypes, ParserTypesType, populateLoaderFromFile } from 'loaders/file';
import {
  expandFragments,
  extractFragmentDefinitionFromKeys,
  Fragment,
  populateFragmentLoaderFromFragment,
  populateFragmentLoaderWithKey,
} from 'loaders/fragment';
import { buildObjectFromKeys } from 'utils/build';
import { camelCaseNaming, NamingConventionFunc } from 'utils/translators/conventions';
import { useTranslatorMap } from 'utils/translators/map';
import { normalizeConfigKeys } from 'utils/translators/normalizer';
import {
  ConfigSchema,
  ConfigSchemaType,
  getTranslateMapFromSchema,
  validateObjectWithSchema,
  validateSchema,
} from './schema';

export function createConfigLoader(): ConfigBuilder<any> {
  const loaders: ConfigLoader = {
    environment: [],
    files: [],
    cli: [],
    dir: [],
    fragments: {
      fragments: {},
      key: '',
    },
  };
  let namingConvention: NamingConventionFunc = camelCaseNaming;
  let schema: ConfigSchema | null = null;

  return {
    addFromEnvironment(prefix: string = '') {
      populateLoaderFromEnvironment(loaders, prefix);
      return this;
    },
    addFromDirectory(path: string, options: DirOptions = {}) {
      populateLoaderFromDir(loaders, { path, ...options });
      return this;
    },
    addFromCLI(prefix: string = '') {
      populateLoaderFromCLI(loaders, prefix);
      return this;
    },
    addFromFile(path: string, type: ParserTypesType = ParserTypes.FROM_EXT): ConfigBuilder<any> {
      populateLoaderFromFile(loaders, path, type);
      return this;
    },
    addJOISchema<Result>(joiSchema: ObjectSchema<Result>): ConfigBuilder<Result> {
      schema = {
        type: ConfigSchemaType.JOI,
        schema: joiSchema,
      };
      validateSchema(schema);
      return this;
    },
    setNamingConvention(convention: NamingConventionFunc) {
      namingConvention = convention;
      return this;
    },
    addConfigFragment(name: string, frag: Fragment) {
      populateFragmentLoaderFromFragment(loaders, name, frag);
      return this;
    },
    addConfigFragments(fragments: Record<string, Fragment>) {
      Object.entries(fragments).forEach(([name, frag]) => populateFragmentLoaderFromFragment(loaders, name, frag));
      return this;
    },
    setFragmentKey(key: string) {
      populateFragmentLoaderWithKey(loaders, key);
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

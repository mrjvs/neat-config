import { configBuilder, configLoader, loadLoaders } from 'builder/base';
import { populateLoaderFromEnvironment } from 'loaders/environment';
import { ParserTypes, ParserTypesType, populateLoaderFromFile } from 'loaders/file';
import { buildObjectFromKeys } from 'utils/build';
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
  };
  let schema: configSchema | null = null;

  return {
    addFromEnvironment(prefix: string = ''): configBuilder<any> {
      populateLoaderFromEnvironment(loaders, prefix);
      return this;
    },
    addFromFile(path: string, type: ParserTypesType = ParserTypes.FROM_EXT): configBuilder<any> {
      populateLoaderFromFile(loaders, path, type);
      return this;
    },
    addJsonSchema<JsonSchema>(jsonSchema: Record<string, any>): configBuilder<JsonSchema> {
      schema = {
        type: configSchemaType.JSON,
        schema: jsonSchema,
      };
      validateSchema(schema);
      return this;
    },
    addClassSchema<ClassSchema>(classSchema: new () => ClassSchema): configBuilder<ClassSchema> {
      schema = {
        type: configSchemaType.CLASS,
        schema: classSchema,
      };
      validateSchema(schema);
      return this;
    },
    load(): any {
      // keys -> normalized keys -> translated keys -> output object
      const keys = loadLoaders(loaders);
      const normalizedKeys = normalizeConfigKeys(keys);

      const translatorMap = getTranslateMapFromSchema(schema);
      const translatedKeys = useTranslatorMap(translatorMap, normalizedKeys);

      const output = buildObjectFromKeys(translatedKeys);
      validateObjectWithSchema(output, schema);

      return output;
    },
  };
}

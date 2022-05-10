import {
  ConfigJOISchema,
  getKeysFromJOISchema,
  validateJOISchemaDefintion,
  validateObjectWithJOISchema,
} from 'schemas/joi';
import { keysToTranslatorMap } from 'utils/translators/map';
import { normalizeKeys } from 'utils/translators/normalizer';
import { TranslatorMap } from 'utils/translators/types';

export enum ConfigSchemaType {
  JOI,
}

export type ConfigSchema = ConfigJOISchema;

export function validateSchema(schemaData: ConfigSchema | null): void {
  if (!schemaData) return; // ignore if no schema
  if (schemaData.type === ConfigSchemaType.JOI) {
    validateJOISchemaDefintion(schemaData);
    return;
  }
}

export function validateObjectWithSchema(
  obj: Record<string, any>,
  schemaData: ConfigSchema | null,
): Record<string, any> {
  if (!schemaData) return obj; // ignore if no schema
  if (schemaData.type === ConfigSchemaType.JOI) {
    return validateObjectWithJOISchema(obj, schemaData);
  }
  // theorically unreachable
  throw new Error('Schema type not recognized');
}

export function getTranslateMapFromSchema(schemaData: ConfigSchema | null): TranslatorMap {
  if (!schemaData) return {};
  if (schemaData.type === ConfigSchemaType.JOI) {
    const keys = getKeysFromJOISchema(schemaData);
    const normalized = normalizeKeys(keys);
    return keysToTranslatorMap(normalized, keys);
  }
  return {};
}

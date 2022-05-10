import {
  configJOISchema,
  getKeysFromJOISchema,
  validateJOISchemaDefintion,
  validateObjectWithJOISchema,
} from 'schemas/joi';
import { keysToTranslatorMap } from 'utils/translators/map';
import { normalizeKeys } from 'utils/translators/normalizer';
import { translatorMap } from 'utils/translators/types';

export enum configSchemaType {
  JOI,
}

export type configSchema = configJOISchema;

export function validateSchema(schemaData: configSchema | null): void {
  if (!schemaData) return; // ignore if no schema
  if (schemaData.type == configSchemaType.JOI) {
    validateJOISchemaDefintion(schemaData);
    return;
  }
}

export function validateObjectWithSchema(
  obj: Record<string, any>,
  schemaData: configSchema | null,
): Record<string, any> {
  if (!schemaData) return obj; // ignore if no schema
  if (schemaData.type == configSchemaType.JOI) {
    return validateObjectWithJOISchema(obj, schemaData);
  }
  // theorically unreachable
  throw new Error('Schema type not recognized');
}

export function getTranslateMapFromSchema(schemaData: configSchema | null): translatorMap {
  if (!schemaData) return {};
  if (schemaData.type == configSchemaType.JOI) {
    const keys = getKeysFromJOISchema(schemaData);
    const normalized = normalizeKeys(keys);
    return keysToTranslatorMap(normalized, keys);
  }
  return {};
}

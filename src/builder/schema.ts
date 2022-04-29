import {
  configClassSchema,
  getKeysFromClassSchema,
  validateClassSchemaDefintion,
  validateObjectWithClassSchema,
} from 'schemas/class';
import { keysToTranslatorMap } from 'utils/translators/map';
import { normalizeKeys } from 'utils/translators/normalizer';
import { translatorMap } from 'utils/translators/types';

export enum configSchemaType {
  JSON,
  CLASS,
}

interface configJsonSchema {
  type: configSchemaType.JSON;
  schema: Record<string, any>;
}

export type configSchema = configJsonSchema | configClassSchema;

export function validateSchema(schemaData: configSchema | null): void {
  if (!schemaData) return; // ignore if no schema
  if (schemaData.type == configSchemaType.JSON) {
    // TODO validate json schema
    return;
  } else if (schemaData.type == configSchemaType.CLASS) {
    validateClassSchemaDefintion(schemaData);
    return;
  }
}

export function validateObjectWithSchema(obj: Record<string, any>, schemaData: configSchema | null): void {
  if (!schemaData) return; // ignore if no schema
  if (schemaData.type == configSchemaType.JSON) {
    // TODO run json schema
    return;
  } else if (schemaData.type == configSchemaType.CLASS) {
    validateObjectWithClassSchema(obj, schemaData);
    return;
  }
}

export function getTranslateMapFromSchema(schemaData: configSchema | null): translatorMap {
  if (!schemaData) return {};
  if (schemaData.type == configSchemaType.JSON) {
    // TODO get map from json schema
    return {};
  } else if (schemaData.type == configSchemaType.CLASS) {
    const keys = getKeysFromClassSchema(schemaData);
    const normalized = normalizeKeys(keys);
    return keysToTranslatorMap(normalized, keys);
  }
  return {};
}

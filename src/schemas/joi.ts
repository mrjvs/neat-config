import { Description, isSchema, Schema } from 'joi';
import { configSchemaType } from 'builder/schema';

export interface configJOISchema {
  type: configSchemaType;
  schema: Schema;
}

export function validateJOISchemaDefintion(schemaData: configJOISchema) {
  if (!isSchema(schemaData.schema)) throw new Error('Schema not a valid JOI schema'); // TODO better errors
  if (schemaData.schema.describe().type !== 'object') throw new Error('Base of schema not an object'); // TODO better errors
}

export function validateObjectWithJOISchema(
  obj: Record<string, any>,
  schemaData: configJOISchema,
): Record<string, any> {
  const { error, value } = schemaData.schema.validate(obj);
  if (error) throw error; // TODO better errors
  return value;
}

function recursiveSearchForKeys(desc: Description, path: string[] = []): string[] {
  const out: string[] = [];
  (Object.entries(desc.keys || {}) as [string, Description][]).forEach(([k, v]) => {
    const keyArray = [...path, k];
    if (v.type === 'object') {
      out.push(...recursiveSearchForKeys(v, keyArray));
      return;
    }
    out.push(keyArray.join('__'));
  });
  return out;
}

export function getKeysFromJOISchema(schemaData: configJOISchema): string[] {
  return recursiveSearchForKeys(schemaData.schema.describe());
}

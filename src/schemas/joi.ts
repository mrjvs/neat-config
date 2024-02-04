import { ConfigSchemaType } from 'builder/schema';
import { Schema, Description } from 'utils/joiTypes';

export interface ConfigJOISchema {
  type: ConfigSchemaType.JOI;
  schema: Schema;
}

export function validateJOISchemaDefintion(schemaData: ConfigJOISchema) {
  if (typeof schemaData.schema.describe !== "function") throw new Error('Schema not a valid JOI schema'); // TODO better errors
  if (schemaData.schema.describe().type !== 'object') throw new Error('Base of schema not an object'); // TODO better errors
}

export function validateObjectWithJOISchema(
  obj: Record<string, any>,
  schemaData: ConfigJOISchema,
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

export function getKeysFromJOISchema(schemaData: ConfigJOISchema): string[] {
  return recursiveSearchForKeys(schemaData.schema.describe());
}

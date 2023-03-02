import { ConfigSchemaType } from 'builder/schema';
import { AnyZodObject, ZodObjectDef } from 'zod';

export interface ConfigZodSchema {
  type: ConfigSchemaType.ZOD;
  schema: AnyZodObject;
}

export function validateZodSchemaDefintion(schemaData: ConfigZodSchema) {
  const def = schemaData.schema._def;
  if (!def) throw new Error('Schema not a valid Zod schema');
  if (def.typeName !== 'ZodObject') throw new Error('Base of schema not an object'); // TODO better errors
}

export function validateObjectWithZodSchema(
  obj: Record<string, any>,
  schemaData: ConfigZodSchema,
): Record<string, any> {
  console.log(obj);
  const result = schemaData.schema.safeParse(obj);
  if (!result.success) throw result.error; // TODO better errors
  return result.data;
}

function recursiveSearchForKeys(desc: ZodObjectDef, path: string[] = []): string[] {
  const out: string[] = [];
  const shape = desc.shape();
  Object.entries(shape).forEach(([k, v]) => {
    const keyArray = [...path, k];
    // TODO potentionally does not work with list of options or something like that
    if (v._def.typeName === 'ZodObject') {
      out.push(...recursiveSearchForKeys(v._def, keyArray));
      return;
    }
    out.push(keyArray.join('__'));
  });
  return out;
}

export function getKeysFromZodSchema(schemaData: ConfigZodSchema): string[] {
  const data = recursiveSearchForKeys(schemaData.schema._def);
  return data;
}

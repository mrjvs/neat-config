import { configSchemaType } from 'builder/schema';
import { validateSync } from 'class-validator';

export interface configClassSchema {
  type: configSchemaType.CLASS;
  schema: new () => any;
}

export function validateClassSchemaDefintion(schemaData: configClassSchema) {
  const ins = new schemaData.schema();
  if (!(ins.__schemaConfig && ins.__schemaConfig().isSchema))
    throw new Error("Schema not valid, doesn't use @ConfigSchema decorator"); // TODO better errors
}

export function validateObjectWithClassSchema(obj: Record<string, any>, schemaData: configClassSchema) {
  const ins = new schemaData.schema();
  Object.assign(ins, obj);
  const errors = validateSync(ins, {
    forbidUnknownValues: true,
    stopAtFirstError: true,
  });
  if (errors.length > 0)
    throw new Error(
      `Configuration failed to load: validation failed for '${errors[0].property}':'${
        Object.values(errors[0].constraints as any)[0]
      }'`,
    ); // TODO better errors
}

export function getKeysFromClassSchema(schemaData: configClassSchema): string[] {
  const ins = new schemaData.schema();
  return [];
}

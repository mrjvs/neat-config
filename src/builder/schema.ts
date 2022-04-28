import { validateSync } from 'class-validator';

export enum configSchemaType {
  JSON,
  CLASS,
}

interface configJsonSchema {
  type: configSchemaType.JSON;
  schema: Record<string, any>;
}

interface configClassSchema {
  type: configSchemaType.CLASS;
  schema: new () => any;
}

export type configSchema = configJsonSchema | configClassSchema;

export function validateSchema(schemaData: configSchema | null): void {
  if (!schemaData) return; // ignore if no schema
  if (schemaData.type == configSchemaType.JSON) {
    // TODO validate json schema
    return;
  } else if (schemaData.type == configSchemaType.CLASS) {
    const ins = new schemaData.schema();
    if (!(ins.__schemaConfig && ins.__schemaConfig().isSchema))
      throw new Error("Schema not valid, doesn't use @ConfigSchema decorator"); // TODO better errors
    return;
  }
}

export function validateObjectWithSchema(obj: Record<string, any>, schemaData: configSchema | null): void {
  if (!schemaData) return; // ignore if no schema
  if (schemaData.type == configSchemaType.JSON) {
    // TODO run json schema
    return;
  } else if (schemaData.type == configSchemaType.CLASS) {
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
    return;
  }
}

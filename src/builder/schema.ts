export enum configSchemaType {
  JSON,
  CLASS,
}

interface configJsonSchema {
  type: configSchemaType.JSON,
  schema: Record<string, any>,
}

interface configClassSchema {
  type: configSchemaType.CLASS,
  schema: new () => any,
}

export type configSchema = configJsonSchema | configClassSchema;

export function validateSchema(schemaData: configSchema | null): void {
  if (!schemaData) return; // ignore if no schema
  if (schemaData.type == configSchemaType.JSON) {
    // TODO validate json schema
    return;
  }
  else if (schemaData.type == configSchemaType.CLASS) {
    // TODO validate class schema
    return;
  }
}

export function validateObjectWithSchema(obj: Record<string, any>, schemaData: configSchema | null): void {
  if (!schemaData) return; // ignore if no schema
  if (schemaData.type == configSchemaType.JSON) {
    // TODO run json schema
    return;
  }
  else if (schemaData.type == configSchemaType.CLASS) {
    // TODO run class schema
    return;
  }
}

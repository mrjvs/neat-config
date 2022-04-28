export interface classSchemaConfig {
  isSchema: true;
}

/**
 * decorator to use as config schema
 */
export function ConfigSchema(target: new () => any): new () => any {
  const config: classSchemaConfig = {
    isSchema: true,
  };
  return class extends target {
    __schemaConfig(): classSchemaConfig {
      return config;
    }
  };
}

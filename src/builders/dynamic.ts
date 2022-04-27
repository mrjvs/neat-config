import { configBuilder, configLoader, load } from "builders/basic";
import { buildObjectFromKeys } from "utils/build";

export interface dynamicConfigBuilder extends configBuilder<dynamicConfigBuilder> {
  load(): Record<string, any>;
}

export function dynamicConfigLoader(): dynamicConfigBuilder {
  const loaders: configLoader = {
    environment: [],
  }
  
  return {
    addFromEnvironment(prefix: string = ""): dynamicConfigBuilder {
      loaders.environment.push({
        prefix,
      })
      return this;
    },
    load() {
      const keys = load(loaders);
      return buildObjectFromKeys(keys);
    }
  }
}

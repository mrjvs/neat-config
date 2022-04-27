import { configBuilder, configLoader, load } from "builders/basic";
import { populateLoaderFromEnvironment } from "loaders/environment";
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
      populateLoaderFromEnvironment(loaders, prefix);
      return this;
    },
    load() {
      const keys = load(loaders);
      return buildObjectFromKeys(keys);
    }
  }
}

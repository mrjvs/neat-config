import { configBuilder, configLoader, load } from "builders/basic";
import { populateLoaderFromEnvironment } from "loaders/environment";
import { ParserTypes, ParserTypesType, populateLoaderFromFile } from "loaders/file";
import { buildObjectFromKeys } from "utils/build";

export interface dynamicConfigBuilder extends configBuilder<dynamicConfigBuilder> {
  load(): Record<string, any>;
}

export function dynamicConfigLoader(): dynamicConfigBuilder {
  const loaders: configLoader = {
     environment: [],
     files: [],
  }
  
  return {
    addFromEnvironment(prefix: string = ""): dynamicConfigBuilder {
      populateLoaderFromEnvironment(loaders, prefix);
      return this;
    },
    addFromFile(path: string, type: ParserTypesType = ParserTypes.FROM_EXT): dynamicConfigBuilder {
      populateLoaderFromFile(loaders, path, type);
      return this;
    },
    load() {
      const keys = load(loaders);
      return buildObjectFromKeys(keys);
    }
  }
}

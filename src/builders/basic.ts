import { configKeys } from "loaders/base";
import { environmentLoader, loadFromEnvironment } from "loaders/environment";

export interface configLoader {
  environment: environmentLoader[]
}

export interface configBuilder<T> {
  addFromEnvironment(prefix?: string): T;
}

export function load(loaders: configLoader): configKeys {
  const keys: configKeys = [
    loadFromEnvironment(loaders.environment),
  ].flat();
  return keys;
}

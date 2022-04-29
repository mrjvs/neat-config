import { configKeys } from 'loaders/base';
import { translatorMap } from './types';

export function keysToTranslatorMap(from: string[], to: string[]): translatorMap {
  return from.reduce<translatorMap>((a, v, i) => {
    a[v] = to[i];
    return a;
  }, {});
}

export function useTranslatorMap(map: translatorMap, keys: configKeys): configKeys {
  return keys.map((v) => ({
    key: map[v.key] || v.key,
    value: v.value,
  }));
}

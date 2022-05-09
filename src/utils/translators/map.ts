import { configKeys } from 'loaders/base';
import { namingConventionFunc } from './conventions';
import { translatorMap } from './types';

export function keysToTranslatorMap(from: string[], to: string[]): translatorMap {
  return from.reduce<translatorMap>((a, v, i) => {
    a[v] = to[i];
    return a;
  }, {});
}

export function useTranslatorMap(
  map: translatorMap,
  keys: configKeys,
  fallback: namingConventionFunc | null,
): configKeys {
  let fallbackFunc = (s: string) => {
    if (!fallback) return s;
    return s
      .split('__')
      .map((v) => fallback(v))
      .join('__');
  };
  return keys.map((v) => ({
    key: map[v.key] || fallbackFunc(v.key),
    value: v.value,
  }));
}

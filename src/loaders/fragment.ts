import { configLoader } from 'builder/base';
import { normalizeKey } from 'utils/translators/normalizer';
import { configKeys } from './base';
import { loadKeysFromObject } from './files/json';

export type fragment = Record<string, any>;

// this loader is special, it gets loaded after loading all other loaders and normalizing.
// but the results get placed BEFORE all the loaded keys
export interface fragmentLoader {
  fragments: Record<string, fragment>; // name of fragment need to be normalized
  key: string; // needs to be normalized
}

// saves the normalized name with the fragment in the loader
export function populateFragmentLoaderFromFragment(loader: configLoader, name: string, fragment: fragment) {
  const normalizedName = normalizeKey(name);
  if (loader.fragments.fragments[normalizedName]) {
    throw new Error('Fragment with the same name already registered'); // TODO better errors
  }
  loader.fragments.fragments[normalizedName] = fragment;
}

export function populateFragmentLoaderWithKey(loader: configLoader, key: string) {
  loader.fragments.key = normalizeKey(key);
}

// extracts fragments to use, and normalizes the input
export function extractFragmentDefinitionFromKeys(
  loader: fragmentLoader,
  keys: configKeys,
): { fragments: string[]; keys: configKeys } {
  let fragmentUses: string = '';
  const filteredKeys = keys.filter((key) => {
    if (key.key === loader.key) {
      fragmentUses = key.value;
      return false;
    }
    return true;
  });
  return {
    keys: filteredKeys,
    fragments: fragmentUses
      .split(',')
      .filter((v) => v.length)
      .map((v) => normalizeKey(v.trim())),
  };
}

export function expandFragments(loader: fragmentLoader, fragments: string[]): configKeys {
  const outputKeys: configKeys = [];
  fragments.forEach((name) => {
    if (!loader.fragments[name]) {
      throw new Error(`Fragment '${name}' doesn't exist`); // TODO better errors
    }
    const keys = loadKeysFromObject(loader.fragments[name]);
    outputKeys.push(...keys);
  });
  return outputKeys;
}

import { configKeys } from 'loaders/base';

/**
 * normalize key segment:
 *  - HelloWorld -> HELLO-WORLD
 *  - helloWorld -> HELLO-WORLD
 *  - hello-world -> HELLO-WORLD
 *  - hello_world -> HELLO-WORLD
 *  - HELLO_WORLD -> HELLO-WORLD
 *  - HELLO-WORLD -> HELLO-WORLD
 * @param segment segment to normalize
 */
function normalizeKeySegment(segment: string): string {
  return segment
    .replace(/([a-z])([A-Z])/g, (_, a, b) => a + '-' + b.toLowerCase())
    .replace(/[\-\_]+/g, '-')
    .toUpperCase();
}

export function normalizeKey(key: string): string {
  return key
    .split('__')
    .map((v) => normalizeKeySegment(v))
    .join('__');
}

export function normalizeKeys(keys: configKeys): configKeys {
  return keys.map((v) => ({
    key: normalizeKey(v.key),
    value: v.value,
  }));
}

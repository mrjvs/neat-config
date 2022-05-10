import { configKeys } from 'loaders/base';

export function buildObjectFromKeys(keys: configKeys): Record<string, any> {
  const output: Record<string, any> = {};
  keys.forEach((v) => {
    let current = output;
    const parts = v.key.split('__');
    const last = parts.pop() as string;
    parts.forEach((path) => {
      if (current[path] !== undefined && current[path].constructor !== Object) throw new Error('conflicting keys'); // TODO better errors
      if (!current[path]) current[path] = {};
      current = current[path];
    });
    if (current[last] && current[last].constructor === Object) throw new Error('conflicting keys'); // TODO better errors
    current[last] = v.value;
  });
  return output;
}

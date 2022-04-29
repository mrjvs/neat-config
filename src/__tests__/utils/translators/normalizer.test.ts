import { normalizeKey, normalizeKeys } from '../../../utils/translators/normalizer';

describe('normalizeKeys()', () => {
  test('normalize single key', () => {
    expect(normalizeKey('HelloWorld')).toBe('HELLO-WORLD');
    expect(normalizeKey('Hello-World')).toBe('HELLO-WORLD');
    expect(normalizeKey('hello-world')).toBe('HELLO-WORLD');
    expect(normalizeKey('helloWorld')).toBe('HELLO-WORLD');
    expect(normalizeKey('hello_world')).toBe('HELLO-WORLD');
    expect(normalizeKey('hello_WORLD')).toBe('HELLO-WORLD');
    expect(normalizeKey('hello_--_-WORLD')).toBe('HELLO-WORLD');
    expect(normalizeKey('hello_--_-WORLD')).toBe('HELLO-WORLD');
  });

  test('normalize multiple keys', () => {
    expect(
      normalizeKeys([
        {
          key: 'helloworld',
          value: '42',
        },
        {
          key: 'hi',
          value: '21',
        },
      ]),
    ).toStrictEqual([
      {
        key: 'HELLOWORLD',
        value: '42',
      },
      {
        key: 'HI',
        value: '21',
      },
    ]);
  });
});

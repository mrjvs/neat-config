import { createConfigLoader } from '../..';

describe('integration tests - freezing', () => {
  test('without freeze', () => {
    process.env = {
      L1__L2__L3: 'test',
      HI: 'test2',
    };
    const config = createConfigLoader().addFromEnvironment().load();
    expect(config).toStrictEqual({
      l1: { l2: { l3: 'test' } },
      hi: 'test2',
    });

    // changes
    config.hi = 'world';
    config.l1.l2.l3 = 'more tests';
    expect(config).toStrictEqual({
      l1: { l2: { l3: 'more tests' } },
      hi: 'world',
    });
  });

  test('with freeze - basic', () => {
    process.env = {
      HI: 'test2',
    };
    const config = createConfigLoader().addFromEnvironment().freeze().load();
    expect(config).toStrictEqual({
      hi: 'test2',
    });

    // testing freeze
    expect(Object.isFrozen(config)).toBe(true);
    expect(() => {
      config.hi = 'HELLO WORLD';
    }).toThrowError(); // in strict mode readonly objects throw typeError when assigned
    expect(config).toStrictEqual({
      hi: 'test2',
    });
  });

  test('with freeze - deep', () => {
    process.env = {
      L1__L2__L3: 'test',
      HI: 'test2',
    };
    const config = createConfigLoader().addFromEnvironment().freeze().load();
    expect(config).toStrictEqual({
      l1: { l2: { l3: 'test' } },
      hi: 'test2',
    });

    // testing deep freeze
    expect(Object.isFrozen(config)).toBe(true);
    expect(Object.isFrozen(config.l1)).toBe(true);
    expect(Object.isFrozen(config.l1.l2)).toBe(true);
    expect(() => {
      config.hi = 'HELLO WORLD';
      config.l1.l2.l3 = 'more tests';
    }).toThrowError(); // in strict mode readonly objects throw typeError when assigned
    expect(config).toStrictEqual({
      l1: { l2: { l3: 'test' } },
      hi: 'test2',
    });
  });
});

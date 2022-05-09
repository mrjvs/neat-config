import { createConfigLoader } from '../..';

describe('integration tests - basic', () => {
  test('load standard config', () => {
    process.env = {
      L1__L2__L3: 'test',
      HI: 'test2',
    };
    const config = createConfigLoader().addFromEnvironment().load();
    expect(config).toStrictEqual({
      L1: { L2: { L3: 'test' } },
      HI: 'test2',
    });
  });

  test('load empty config', () => {
    const config = createConfigLoader().load();
    expect(config).toStrictEqual({});
  });
});

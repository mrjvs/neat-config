import { createConfigLoader } from '../..';
import { camelCaseNaming } from '../../utils/translators/conventions';

describe('integration tests - basic', () => {
  test('load standard config', () => {
    process.env = {
      HELLO_WORLD__HI_AGAIN__L3: 'test',
      HI: 'test2',
    };
    const config = createConfigLoader().addFromEnvironment().setNamingConvention(camelCaseNaming).load();
    expect(config).toStrictEqual({
      helloWorld: { hiAgain: { l3: 'test' } },
      hi: 'test2',
    });
  });
});

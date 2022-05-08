import * as Joi from 'joi';
import { createConfigLoader } from '../..';

describe('integration tests - joi schema', () => {
  test('normal usage, valid', () => {
    process.env = {
      CONF_HI: 'test2',
    };
    const schema = Joi.object({
      HI: Joi.string(),
    });
    const config = createConfigLoader().addFromEnvironment('CONF_').addJOISchema<any, any>(schema).load();
    expect(config).toStrictEqual({
      HI: 'test2',
    });
  });

  test('normal usage, invalid', () => {
    process.env = {
      CONF_HI: 'test2',
    };
    const schema = Joi.object({
      HI: Joi.number(),
    });
    const config = createConfigLoader().addFromEnvironment('CONF_').addJOISchema<any, any>(schema);
    expect(() => config.load()).toThrowError(); // TODO better errors;
  });

  test('invalid schema', () => {
    function trySchema(s: any) {
      expect(() => createConfigLoader().addJOISchema(s)).toThrowError(); // TODO better errors
    }

    trySchema({ hi: 42 });
    trySchema(null);
    trySchema(undefined);
    trySchema(Joi.string().email());
  });
});

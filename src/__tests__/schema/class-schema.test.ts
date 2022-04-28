import { IsNotEmpty } from 'class-validator';
import { createConfigLoader, ConfigSchema } from '../../index';

class InvalidClassSchema {
  @IsNotEmpty()
  hello!: string;
}

@ConfigSchema
class SimpleClassSchema {
  @IsNotEmpty()
  hello!: string;
}

// TODO do deep validation checks
describe('class schema validation tests', () => {
  test('invalid class schema', () => {
    const createConfig = () => createConfigLoader().addClassSchema(InvalidClassSchema);
    expect(createConfig).toThrowError(); // TODO better errors
  });
  test('simple class schema validation errors', () => {
    process.env = {
      hello: '',
    };
    const invalidConfig = () => createConfigLoader().addFromEnvironment().addClassSchema(SimpleClassSchema).load();
    expect(invalidConfig).toThrow(); // TODO better errors
    const invalidConfig2 = () => createConfigLoader().addClassSchema(SimpleClassSchema).load();
    expect(invalidConfig2).toThrow(); // TODO better errors
  });
  test('simple class schema validation pass', () => {
    process.env = {
      hello: 'hi',
    };
    const validConfig = createConfigLoader().addFromEnvironment().addClassSchema(SimpleClassSchema).load();
    expect(validConfig).toStrictEqual({
      hello: 'hi',
    });
  });
});

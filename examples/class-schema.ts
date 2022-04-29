import { createConfigLoader, ConfigSchema } from '../lib';
import { IsNotEmpty } from 'class-validator';

@ConfigSchema
class Schema {
  @IsNotEmpty()
  hello!: string;
}

// prettier-ignore
const config = createConfigLoader()
  .addFromEnvironment()
  .addFromFile("./config.json")
  .addClassSchema(Schema)
  .load();

console.log(config);

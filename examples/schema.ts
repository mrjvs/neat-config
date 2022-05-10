import { createConfigLoader } from '../lib';
import * as joi from 'joi';

process.env.CONF_HI = 'Hello world';

interface config {
  Hi: string;
}

const schema = joi.object<config>({
  Hi: joi.string(),
});

// prettier-ignore
const config = createConfigLoader()
  .addFromEnvironment("CONF_")
  .addFromFile("./config.json")
  .addJOISchema(schema)
  .load();

console.log(config);

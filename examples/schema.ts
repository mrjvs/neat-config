import { createConfigLoader } from '../lib';
import { z } from 'zod';

process.env.CONF_HI = 'Hello world';

const schema = z.object({
  Hi: z.string(),
});

// prettier-ignore
const config = createConfigLoader()
  .addFromEnvironment("CONF_")
  .addFromFile("./config.json")
  .addZodSchema(schema)
  .load();

console.log(config);

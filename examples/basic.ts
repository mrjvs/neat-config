import { createConfigLoader } from 'cool-config';

// prettier-ignore
const config = createConfigLoader()
  .addFromEnvironment()
  .load();

console.log(config);

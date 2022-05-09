# cool-config

Yet another config library,
But specialized for cloud deployment this time

> **WORK IN PROGRESS**

## Docs todo list:

- good examples
- why to use this library over the others?
- How keys are created (how to use environment variables)
- How specific input sources work
- Security (dont use for untrusted input)
- Bugs (make an issue)
- Contributing (use tests, make PR's, make issue first for planning)
- explain every function on the builder
- Naming conventions (defaults to camelCase, uses schema if supplied, overwritable)
- fragments and how to use them
- load details (loaded in order, overwrites each other, only objects and strings, naming conventions dont matter)

# features

- strictly typed OR loosly typed configurations
- complex object configuration
- load (partial) configuration from many inputs:
  - from files: `.json`, `.env`
  - from environment variables
  - from directory structure (used for i.e docker secrets)
  - from CLI arguments
- schema validation and transformation using JOI

# install

```sh
npm install cool-config
```

# basic usage

##### Loosly typed / no schema

```js
const { createConfigLoader, parserTypes } = require('cool-config');

const config = createConfigLoader()
  .addFromEnvironment()
  .addFromFile('.env')
  .addFromFile('config.json')
  .addFromFile('config.test', parserTypes.JSON) // manually set it to use json parser
  .load();

// config object now has all the values from the input sources
console.log(config);
```

#### Strictly typed / with schema

```js
/* --- with schema --- */
const schema = {
  example: {
    test: {
      type: String,
      required: true,
    },
  },
};
const configWithSchema = schemaConfigLoader(schema).addFromEnvironment().addFromFile('.env').load();
console.log(configWithSchema.example.test);

/* --- with schema & typescript --- */
interface configSchema {
  example: {
    text: string,
  };
}
const configWithSchemaTypescript = schemaConfigLoader<configSchema>()
  .addFromEnvironment()
  .addFromFile('.env')
  .load();
console.log(configWithSchemaTypescript.example.test);
```

# How it works

This library is key based, you can set any complex object value using a key.

- Case insensitive
- nested values are seperated by `__`
- arrays can be access with the index: `ARRAY__0__FOO`

A few examples:

```js
const complexObject = {
  level1: {
    level2: {
      level3: {
        foo: 'bar',
      },
    },
  },
  array: [
    {
      hello: 'WORLD',
    },
  ],
};

// To set `level1.level2.level3.foo`, the key would be:
// LEVEL1__LEVEL2__LEVEL3__FOO

// To set `array[0].hello`, the key would be:
// ARRAY__0__HELLO
```

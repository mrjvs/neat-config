# cool-config

Yet another config library,
But specialized for cloud deployment this time

> **WORK IN PROGRESS**

# features

- fully typed configurations
- load configuration from many inputs:
  - from files: `.json`, `.env`
  - from environment variables
  - from directory structure (i.e docker secrets)

# install

```sh
npm install cool-config
```

# basic usage

```js
const { dynamicConfigLoader, schemaConfigLoader, parserTypes } = require('cool-config');

/* --- without schema --- */
const configWithoutSchema = dynamicConfigLoader()
  .addFromEnvironment()
  .addFromFile('.env')
  .addFromFile('config.json')
  .addFromFile('config.test', parserTypes.JSON) // set parser manually if it cant detect from extension
  .addFromDirectories('~/.config/my-app') // load from files in directory, filename is the key. content is the value
  .load();

// configWithoutSchema is a normal object now with all values
console.log(configWithoutSchema.example.test);

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
const configWithSchemaTypescript =
  schemaConfigLoader < configSchema > schema.addFromEnvironment().addFromFile('.env').load();
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

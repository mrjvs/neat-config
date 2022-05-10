# neat-config

Yet another config library,
But specialized for cloud deployment this time

> **WORK IN PROGRESS**

# features

- strictly typed OR loosly typed configurations
- complex object configuration
- load (partial) configuration from many inputs:
  - from files: `.json`, `.env`
  - from environment variables
  - from directory structure (used for i.e docker secrets)
  - from CLI arguments
- validate from a JOI schema

# install

```sh
npm install neat-config
```

# basic usage

```js
const { createConfigLoader, parserTypes } = require('neat-config');

const config = createConfigLoader()
  .addFromEnvironment()
  .addFromFile('.env')
  .addFromFile('config.json')
  .addFromFile('config.test', parserTypes.JSON) // set parser manually if it cant detect from extension
  .addFromDirectory('~/.config/my-app') // load from files in directory, filename is the key. content is the value
  .load();

// config is a normal object now with all values
console.log(config.example.test);
```

# How it works

This library is key based, you can set any complex object value using a key.

- Case insensitive
- nested values are seperated by `__`

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
};

// To set `level1.level2.level3.foo`, the key would be:
// LEVEL1__LEVEL2__LEVEL3__FOO
```

import * as fs from 'fs';
import { getKeysFromFiles, populateLoaderFromFile } from '../../loaders/file';
import { ParserTypes } from '../../loaders/file';
jest.mock('fs');
  
function checkIfArrayHas(test: any, value: any) {
  expect(test).toBeInstanceOf(Array);
  expect(test.length).toBe(value.length);
  for (let obj of test) {
    const found = value.find((v: any)=>v.key===obj.key);
    expect(found).toBeTruthy();
    expect(obj).toStrictEqual(found);
  }
}

describe('file loader - basics', () => {
  test('extension loading - json', () => {
    const obj = {
      environment: [],
      files: []
    }
    populateLoaderFromFile(obj, "hi.json", ParserTypes.FROM_EXT);
    populateLoaderFromFile(obj, ".json", ParserTypes.FROM_EXT);
    populateLoaderFromFile(obj, ".test.json", ParserTypes.FROM_EXT);
    expect(obj.files).toStrictEqual([
      { type: ParserTypes.JSON, path: "hi.json" },
      { type: ParserTypes.JSON, path: ".json" },
      { type: ParserTypes.JSON, path: ".test.json" },
    ])
  });
  test('extension loading - env', () => {
    const obj = {
      environment: [],
      files: []
    }
    populateLoaderFromFile(obj, ".env", ParserTypes.FROM_EXT);
    populateLoaderFromFile(obj, "prod.env", ParserTypes.FROM_EXT);
    populateLoaderFromFile(obj, ".prod.env", ParserTypes.FROM_EXT);
    expect(obj.files).toStrictEqual([
      { type: ParserTypes.ENV, path: ".env" },
      { type: ParserTypes.ENV, path: "prod.env" },
      { type: ParserTypes.ENV, path: ".prod.env" }
    ])
  });
  test('extension loading - expections', () => {
    const obj = {
      environment: [],
      files: []
    }
    expect(() => populateLoaderFromFile(obj, "hello-world", ParserTypes.FROM_EXT))
      .toThrowError(); // TODO proper error
  });
})

describe('file loader - json', () => {

  function mockJsonFile(obj: any) {
    (fs.readFileSync as any).mockReturnValueOnce(JSON.stringify(obj));
  }

  test('simple key loading', () => {
    mockJsonFile({
      test1: "abc",
      test2: true,
      test3: 42,
    })
    checkIfArrayHas(getKeysFromFiles([{ path: "hi", type: ParserTypes.JSON }]), [
      { key: "test1", value: "abc" },
      { key: "test2", value: "true" },
      { key: "test3", value: "42" },
    ]);
  });

  test('deep key loading', () => {
    mockJsonFile({
      test1: "abc",
      l1: {
        l2: {
          l3: "def"
        },
        l2v2: "ghi"
      },
    })
    checkIfArrayHas(getKeysFromFiles([{ path: "hi", type: ParserTypes.JSON }]), [
      { key: "test1", value: "abc" },
      { key: "l1__l2__l3", value: "def" },
      { key: "l1__l2v2", value: "ghi" },
    ]);
  });

})

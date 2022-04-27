import { dynamicConfigLoader } from "../..";

describe("integration tests - basic", () => {
  test("load dynamic config", () => {
    process.env = {
      "L1__L2__L3": "test",
      "HI": "test2",
    }
    const config = dynamicConfigLoader()
      .addFromEnvironment()
      .load();
    expect(config).toStrictEqual({
      L1: { L2: { L3: "test" }},
      HI: "test2"
    })
  })
  test("load empty config", () => {
    const config = dynamicConfigLoader()
      .load();
    expect(config).toStrictEqual({})
  })
})

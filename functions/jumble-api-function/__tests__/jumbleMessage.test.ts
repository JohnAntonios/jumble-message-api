import expect from "expect";
import { jumble } from "../src/functions/jumbleMessage";

describe("Jumble Message", () => {
  it(`should return 'test 123' when ('test 123!', 0) is passed`, () => {
    expect(jumble("test 123", 0)).toStrictEqual("test 123");
  }),
    it(`should return 'uftu 123' when ('test 123!', 1) is passed`, () => {
      expect(jumble("test 123!", 1)).toStrictEqual("uftu 123");
    }),
    it(`should return 'paop 123' when ('test 123!', 100) is passed`, () => {
      expect(jumble("test 123!", 100)).toStrictEqual("paop 123");
    }),
    it(`should return 'test 123' when ('test 123!', 26) is passed`, () => {
      expect(jumble("test 123!", 26)).toStrictEqual("test 123");
    }),
    it(`should return 'Vguv 123' when ('Test 123!', 2) is passed`, () => {
      expect(jumble("Test 123!", 2)).toStrictEqual("Vguv 123");
    });
});

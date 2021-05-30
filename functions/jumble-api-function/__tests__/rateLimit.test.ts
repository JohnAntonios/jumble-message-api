import expect from "expect";
import { MAX_RATE_LIMIT_CALLS } from "../src/constants/rateLimit";
import rateLimit from "../src/utils/rateLimit";

const SAMPLE_IP = "127.0.0.1";
const SAMPLE_IP_2 = "128.0.0.1";

describe("Rate Limit", () => {
  before(() => {
    const time = new Date().getTime();
    rateLimit(SAMPLE_IP, time);
    rateLimit(SAMPLE_IP_2, time);
  });
  it(`should not reach limit and decrement 'remainingCalls' by 1, when a new IP is added`, () => {
    const time = new Date().getTime();
    const newIp = "129.0.0.1";

    const { hasReachedLimit, remainingCalls } = rateLimit(newIp, time);

    expect(hasReachedLimit).toStrictEqual(false);
    expect(remainingCalls).toStrictEqual(MAX_RATE_LIMIT_CALLS - 1);
  }),
    it(`should decrement 'remainingCalls' by 1, when an existing IP is found`, () => {
      const time = new Date().getTime();
      const { hasReachedLimit, remainingCalls } = rateLimit(SAMPLE_IP, time);

      expect(hasReachedLimit).toStrictEqual(false);
      expect(remainingCalls).toStrictEqual(MAX_RATE_LIMIT_CALLS - 2);
    }),
    it("should reach limit when an existing IP calls more than the given maximum number within the given time frame", () => {
      const time = new Date().getTime();
      const newIp = "124.0.0.1";

      for (let i = 0; i <= MAX_RATE_LIMIT_CALLS; i++) {
        rateLimit(newIp, time);
      }

      const { hasReachedLimit } = rateLimit(newIp, time);

      expect(hasReachedLimit).toStrictEqual(true);
    }),
    it("should reset when an existing IP calls after the given time frame", () => {
      const time = new Date();

      const { remainingCalls } = rateLimit(SAMPLE_IP_2, time.getTime());

      expect(remainingCalls).toStrictEqual(MAX_RATE_LIMIT_CALLS - 2);

      const newTime = time.setMinutes(1);

      const { remainingCalls: resetRemainingCalls } = rateLimit(
        SAMPLE_IP,
        newTime
      );

      expect(resetRemainingCalls).toStrictEqual(MAX_RATE_LIMIT_CALLS - 1);
    });
});

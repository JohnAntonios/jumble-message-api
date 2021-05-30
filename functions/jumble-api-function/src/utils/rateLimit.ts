import {
  MAX_RATE_LIMIT_CALLS,
  MAX_RATE_LIMIT_TIME,
} from "../constants/rateLimit";

interface RateLimitIPAddresses {
  [ipAddress: string]: {
    remainingCalls: number;
    latestTime: number;
  };
}

const requestIpAddresses: RateLimitIPAddresses = {};

const resetRateLimit = (ip: string, requestTime: number) => {
  requestIpAddresses[ip] = {
    remainingCalls: MAX_RATE_LIMIT_CALLS - 1,
    latestTime: requestTime,
  };
};

export const generateRateLimitHeader = (remainingCalls: number) => ({
  "x-remaining-calls": remainingCalls,
});

export default (ip: string, requestTime: number) => {
  const foundIp = requestIpAddresses[ip];

  let remainingCalls = MAX_RATE_LIMIT_CALLS - 1;

  if (foundIp) {
    const secondsDifference = Math.abs(
      (requestTime - foundIp.latestTime) / 1000
    );

    if (secondsDifference < MAX_RATE_LIMIT_TIME) {
      remainingCalls = foundIp.remainingCalls - 1;

      if (remainingCalls > 0) {
        foundIp.remainingCalls = remainingCalls;
      }
    } else {
      resetRateLimit(ip, requestTime);
    }
  } else {
    resetRateLimit(ip, requestTime);
  }

  return {
    remainingCalls,
    hasReachedLimit: remainingCalls === 0,
  };
};

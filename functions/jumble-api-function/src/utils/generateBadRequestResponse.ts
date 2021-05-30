import { generateRateLimitHeader } from "./rateLimit";

export default (message: string, remainingCalls: number) => ({
  statusCode: 400,
  body: JSON.stringify({ message }),
  headers: generateRateLimitHeader(remainingCalls),
});

import {
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  Context,
} from "aws-lambda";
import generateBadRequestResponse from "../utils/generateBadRequestResponse";
import getRateLimit from "../utils/rateLimit";

export const jumble = (message: string, amountToShift: number): string => {
  let jumbledMessage = "";
  const canShift = amountToShift >= 1 && amountToShift <= 1000;

  for (const char of message) {
    if (char.match(/[a-z]/i) && canShift) {
      // Get the unicode value
      const code = char.charCodeAt(0);

      // Setup the shift unicode
      let shiftCode = 0;

      // 65 - 90 is the range for A-Z (uppercase letters)
      if (code >= 65 && code <= 90) {
        shiftCode = 65;
      }
      // 97 - 122 is the range for a-z (lowercase letters)
      else if (code >= 97 && code <= 122) {
        shiftCode = 97;
      }

      // Get the new shifted code based on the amount to shift by
      const shiftedCode = code - shiftCode + amountToShift;

      // Mod by the number of letters in the alphabet and add on the shift.
      const computedShift = (shiftedCode % 26) + shiftCode;

      jumbledMessage += String.fromCharCode(computedShift);
    }
    // Special characters
    else if (char.match(/[^A-Za-z 0-9]/g)) {
      continue;
    } else {
      jumbledMessage += char;
    }
  }

  return jumbledMessage;
};

export const index = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const requestTime = new Date().getTime();

  const ip = event.requestContext && event.requestContext["http"].sourceIp;

  const { remainingCalls, hasReachedLimit } = getRateLimit(ip, requestTime);

  if (hasReachedLimit) {
    return {
      statusCode: 429,
      body: "",
    };
  }

  if (!event.body) {
    return generateBadRequestResponse("Missing body", remainingCalls);
  }

  const data = JSON.parse(event.body);

  if (!data.message) {
    return generateBadRequestResponse(
      "[Missing body property] - `message`",
      remainingCalls
    );
  }

  if (!event.pathParameters || !event.pathParameters["n"]) {
    return generateBadRequestResponse(
      "[Missing path param] - `n`",
      remainingCalls
    );
  }

  const amountToShift = parseInt(event.pathParameters["n"], 10);

  const jumbled = jumble(data.message, amountToShift);

  return {
    statusCode: 200,
    body: JSON.stringify({ jumbled }),
    headers: {
      "x-remaining-calls": remainingCalls,
    },
  };
};

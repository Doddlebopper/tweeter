import type { GetUserResponse } from "tweeter-shared";
import { createFailureResponse } from "../responses-common/responsesCommon";

const emptyUserPayload = {
  user: null,
};

export const buildUserFailureResponse = (
  message: string
): GetUserResponse => createFailureResponse(message, emptyUserPayload);


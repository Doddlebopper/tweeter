import type { LogoutRequest, TweeterResponse } from "tweeter-shared";
import { AuthenticationService } from "../../model/service/AuthenticationService";
import { buildTweeterFailureResponse, toAuthToken } from "../common/auth-common/authCommon";

export const handler = async (
  request: LogoutRequest
): Promise<TweeterResponse> => {
  const authService = new AuthenticationService();

  const authToken = toAuthToken(request.authToken);

  if (!authToken) {
    return buildTweeterFailureResponse("Missing auth token.");
  }

  try {
    await authService.logout(authToken);
    return {
      success: true,
      message: null,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to logout.";
    return buildTweeterFailureResponse(message);
  }
};

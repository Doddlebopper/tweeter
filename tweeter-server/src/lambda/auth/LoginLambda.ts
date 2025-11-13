import type { LoginRequest, LoginResponse } from "tweeter-shared";
import { AuthenticationService } from "../../model/service/AuthenticationService";
import { buildAuthFailureResponse, buildAuthSuccessResponse } from "../common/auth-common/authCommon";

export const handler = async (
  request: LoginRequest
): Promise<LoginResponse> => {
  const authService = new AuthenticationService();

  const { alias, password } = request;

  try {
    const [user, authToken] = await authService.login(alias, password);

    return buildAuthSuccessResponse<LoginResponse>(user, authToken);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to complete login.";
    return buildAuthFailureResponse<LoginResponse>(message);
  }
};

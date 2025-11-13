import type { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { buildUserFailureResponse } from "../common/user-common/getUserCommon";
import { toAuthToken } from "../common/auth-common/authCommon";

export const handler = async (
  request: GetUserRequest
): Promise<GetUserResponse> => {
  const userService = new UserService();

  const authToken = toAuthToken(request.authToken);
  if (!authToken) {
    return buildUserFailureResponse("Missing auth token.");
  }

  const user = await userService.getUser(authToken, request.alias);

  if (!user) {
    return buildUserFailureResponse(`No user found for alias ${request.alias}.`);
  }

  return {
    success: true,
    message: null,
    user: user.dto,
  };
};


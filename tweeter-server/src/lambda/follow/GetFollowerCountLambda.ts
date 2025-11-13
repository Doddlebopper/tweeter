import type {
  FollowCountRequest,
  FollowCountResponse,
} from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import {
  buildFollowCountFailureResponse,
  toUser,
} from "../common/follow-common/followCommon";
import { toAuthToken } from "../common/auth-common/authCommon";

export const handler = async (
  request: FollowCountRequest
): Promise<FollowCountResponse> => {
  const followService = new FollowService();

  const authToken = toAuthToken(request.authToken);
  if (!authToken) {
    return buildFollowCountFailureResponse("Missing auth token.");
  }

  const user = toUser(request.user);
  if (!user) {
    return buildFollowCountFailureResponse("Invalid user data provided.");
  }

  const count = await followService.getFollowerCount(authToken, user);

  return {
    success: true,
    message: null,
    count,
  };
};


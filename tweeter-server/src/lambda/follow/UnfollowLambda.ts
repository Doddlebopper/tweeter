import type { FollowActionRequest, TweeterResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { buildFollowActionFailureResponse, toUser } from "../common/follow-common/followCommon";
import { toAuthToken } from "../common/auth-common/authCommon";

export const handler = async (
  request: FollowActionRequest
): Promise<TweeterResponse> => {
  const followService = new FollowService();

  const authToken = toAuthToken(request.authToken);
  if (!authToken) {
    return buildFollowActionFailureResponse("Missing auth token.");
  }

  const targetUser = toUser(request.targetUser);
  if (!targetUser) {
    return buildFollowActionFailureResponse("Invalid user data provided.");
  }

  await followService.unfollow(authToken, targetUser);

  return {
    success: true,
    message: null,
  };
};


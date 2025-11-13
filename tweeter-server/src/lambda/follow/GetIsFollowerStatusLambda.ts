import type {
  FollowStatusRequest,
  FollowStatusResponse,
} from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import {
  buildFollowStatusFailureResponse,
  toUser,
} from "../common/follow-common/followCommon";
import { toAuthToken } from "../common/auth-common/authCommon";

export const handler = async (
  request: FollowStatusRequest
): Promise<FollowStatusResponse> => {
  const followService = new FollowService();

  const authToken = toAuthToken(request.authToken);
  if (!authToken) {
    return buildFollowStatusFailureResponse("Missing auth token.");
  }

  const user = toUser(request.user);
  const selectedUser = toUser(request.selectedUser);

  if (!user || !selectedUser) {
    return buildFollowStatusFailureResponse("Invalid user data provided.");
  }

  const isFollower = await followService.getIsFollowerStatus(
    authToken,
    user,
    selectedUser
  );

  return {
    success: true,
    message: null,
    isFollower,
  };
};


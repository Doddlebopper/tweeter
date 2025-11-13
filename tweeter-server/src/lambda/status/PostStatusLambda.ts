import type {
  PostStatusRequest,
  PostStatusResponse,
} from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { buildPostStatusFailureResponse, toStatus } from "../common/status-common/statusCommon";
import { toAuthToken } from "../common/auth-common/authCommon";

export const handler = async (
  request: PostStatusRequest
): Promise<PostStatusResponse> => {
  const statusService = new StatusService();

  const authToken = toAuthToken(request.authToken);
  if (!authToken) {
    return buildPostStatusFailureResponse("Missing auth token.");
  }

  const status = toStatus(request.status);
  if (!status) {
    return buildPostStatusFailureResponse("Invalid status provided.");
  }

  await statusService.postStatus(authToken, status);

  return {
    success: true,
    message: null,
  };
};


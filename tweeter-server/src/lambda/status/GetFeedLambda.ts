import type { PagedStatusRequest, PagedStatusResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { buildPagedStatusFailureResponse, toStatus } from "../common/status-common/statusCommon";
import { toAuthToken } from "../common/auth-common/authCommon";

export const handler = async (
  request: PagedStatusRequest
): Promise<PagedStatusResponse> => {
  const statusService = new StatusService();

  const authToken = toAuthToken(request.authToken);
  if (!authToken) {
    return buildPagedStatusFailureResponse("Missing auth token.");
  }

  const lastStatus = toStatus(request.lastItem);

  const [statuses, hasMoreItems] = await statusService.loadMoreFeedItems(
    authToken,
    request.userAlias,
    request.pageSize,
    lastStatus
  );

  return {
    success: true,
    message: null,
    statuses: statuses.map((status) => status.dto),
    hasMoreItems,
  };
};


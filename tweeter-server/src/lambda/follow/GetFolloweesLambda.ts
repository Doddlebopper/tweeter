import type { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { buildPagedUsersFailureResponse } from "../common/follow-common/followCommon";
import { toAuthToken } from "../common/auth-common/authCommon";

export const handler = async (
  request: PagedUserItemRequest
): Promise<PagedUserItemResponse> => {
  const followService = new FollowService();

  const authToken = toAuthToken(request.authToken);

  if (!authToken) {
    return buildPagedUsersFailureResponse("Missing auth token.");
  }

  const [items, hasMoreItems] = await followService.loadMoreFollowees(
    authToken,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );

  return {
    success: true,
    message: null,
    items,
    hasMoreItems,
  };
};
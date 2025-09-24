import { AuthToken, FakeData, Status } from "tweeter-shared";
import StatusItemScroller from "./StatusItemScroller";

const loadMoreFeedItems = async (
  authToken: AuthToken,
  userAlias: string,
  pageSize: number,
  lastItem: Status | null
): Promise<[Status[], boolean]> => {
  // TODO: Replace with the result of calling server
  return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
};

const FeedScroller = () => {
  return (
    <StatusItemScroller
      featurePath="/feed"
      loadMoreFunction={loadMoreFeedItems}
      errorMessage="Failed to load feed items because of exception"
    />
  );
};

export default FeedScroller;

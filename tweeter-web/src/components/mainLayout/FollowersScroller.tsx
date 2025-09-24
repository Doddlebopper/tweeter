import { AuthToken, FakeData, User } from "tweeter-shared";
import UserItemScroller from "./UserItemScroller";

const loadMoreFollowers = async (
  authToken: AuthToken,
  userAlias: string,
  pageSize: number,
  lastFollower: User | null
): Promise<[User[], boolean]> => {
  // TODO: Replace with the result of calling server
  return FakeData.instance.getPageOfUsers(lastFollower, pageSize, userAlias);
};

const FollowersScroller = () => {
  return (
    <UserItemScroller
      featurePath="/followers"
      loadMoreFunction={loadMoreFollowers}
      errorMessage="Failed to load followers because of exception"
    />
  );
};

export default FollowersScroller;

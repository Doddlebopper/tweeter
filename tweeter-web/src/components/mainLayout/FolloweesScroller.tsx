import { AuthToken, FakeData, User } from "tweeter-shared";
import UserItemScroller from "./UserItemScroller";

const loadMoreFollowees = async (
  authToken: AuthToken,
  userAlias: string,
  pageSize: number,
  lastFollowee: User | null
): Promise<[User[], boolean]> => {
  // TODO: Replace with the result of calling server
  return FakeData.instance.getPageOfUsers(lastFollowee, pageSize, userAlias);
};

const FolloweesScroller = () => {
  return (
    <UserItemScroller
      featurePath="/followees"
      loadMoreFunction={loadMoreFollowees}
      errorMessage="Failed to load followees because of exception"
    />
  );
};

export default FolloweesScroller;

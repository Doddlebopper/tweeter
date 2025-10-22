import { User } from "tweeter-shared";
import { AuthToken } from "tweeter-shared";
import UserItem from "../userItem/UserItem";
import { UserItemPresenter } from "../../presenter/UserItemPresenter";
import { PagedItemView } from "../../presenter/PagedItemPresenter";
import { FollowService } from "../../model.service/FollowService";
import PagedItemScroller from "./PagedItemScroller";

interface UserItemScrollerProps {
  featurePath: string;
  presenterFactory: (listener: PagedItemView<User>) => UserItemPresenter;
}

const UserItemScroller = ({ 
  featurePath, 
  presenterFactory
}: UserItemScrollerProps) => {
  const userComponentGenerator = (user: User) => (
    <div className="row mb-3 mx-0 px-0 border rounded bg-white">
      <UserItem user={user} featurePath={featurePath} />
    </div>
  );

  const getUserFromPresenter = async (authToken: AuthToken, alias: string): Promise<User | null> => {
    // We need to get the presenter instance to call getUser
    // This is a bit tricky since we don't have direct access to the presenter here
    // We'll create a temporary presenter just to get the user
    const tempPresenter = presenterFactory({
      addItems: () => {},
      displayErrorMessage: () => {}
    });
    return tempPresenter.getUser(authToken, alias);
  };

  return (
    <PagedItemScroller<User, FollowService>
      featurePath={featurePath}
      presenterFactory={presenterFactory}
      itemComponentGenerator={userComponentGenerator}
      getUserMethod={getUserFromPresenter}
    />
  );
};

export default UserItemScroller;

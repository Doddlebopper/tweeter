import { AuthToken, User, FakeData } from "tweeter-shared";
import { Service } from "./Service";

export class FollowService implements Service {
    public async loadMoreFollowees(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastUser: User | null
      ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getPageOfUsers(lastUser, pageSize, null);
    }
    
    public async loadMoreFollowers(
      authToken: AuthToken,
      userAlias: string,
      pageSize: number,
      lastUser: User | null
    ): Promise<[User[], boolean]> {
      // TODO: Replace with the result of calling server
      return FakeData.instance.getPageOfUsers(lastUser, pageSize, null);
    }

    public async getIsFollowerStatus(
      authToken: AuthToken,
      user: User,
      selectedUser: User
    ): Promise<boolean> {
      // TODO: Replace with the result of calling server
      return FakeData.instance.isFollower();
    }

    public async getFolloweeCount(
      authToken: AuthToken,
      user: User
    ): Promise<number> {
      // TODO: Replace with the result of calling server
      return FakeData.instance.getFolloweeCount(user.alias);
    }

    public async getFollowerCount(
      authToken: AuthToken,
      user: User
    ): Promise<number> {
      // TODO: Replace with the result of calling server
      return FakeData.instance.getFollowerCount(user.alias);
    }

    public async follow(
      authToken: AuthToken,
      userToFollow: User
    ): Promise<void> {
      // Pause so we can see the follow message. Remove when connected to the server
      await new Promise((f) => setTimeout(f, 2000));

      // TODO: Call the server
    }

    public async unfollow(
      authToken: AuthToken,
      userToUnfollow: User
    ): Promise<void> {
      // Pause so we can see the unfollow message. Remove when connected to the server
      await new Promise((f) => setTimeout(f, 2000));

      // TODO: Call the server
    }
};  
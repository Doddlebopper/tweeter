import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";
import { Service } from "tweeter-web/src/model.service/Service";
import { pause } from "./service-common/serviceCommon";

export class FollowService implements Service {

    public async loadMoreFollowees(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastUser: UserDto | null
      ): Promise<[UserDto[], boolean]> {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastUser, pageSize, userAlias);
    }
    
    public async loadMoreFollowers(
      authToken: AuthToken,
      userAlias: string,
      pageSize: number,
      lastUser: UserDto | null
    ): Promise<[UserDto[], boolean]> {
      // TODO: Replace with the result of calling server
      return this.getFakeData(lastUser, pageSize, userAlias);
    }

  private getFakeData(lastUser: UserDto | null, pageSize: number, userAlias: string): [UserDto[], boolean] {
    const [items, hasMoreItems] = FakeData.instance.getPageOfUsers(User.fromDto(lastUser), pageSize, userAlias);
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMoreItems];
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
      await pause(2000);

      // TODO: Call the server
    }

    public async unfollow(
      authToken: AuthToken,
      userToUnfollow: User
    ): Promise<void> {
      // Pause so we can see the unfollow message. Remove when connected to the server
      await pause(2000);

      // TODO: Call the server
    }
};  
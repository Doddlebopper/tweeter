import {
  AuthToken,
  User,
  type FollowCountResponse,
  type FollowStatusResponse,
  type PagedUserItemResponse,
  type TweeterResponse,
} from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";
import { Service } from "./Service";

export class FollowService implements Service {
  private readonly serverFacade = ServerFacade.getInstance();

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastUser: User | null
  ): Promise<[User[], boolean]> {
    const response: PagedUserItemResponse = await this.serverFacade.getFollowees({
      authToken: {
        token: authToken.token,
        timestamp: authToken.timestamp,
      },
      userAlias,
      pageSize,
      lastItem: lastUser ? lastUser.dto : null,
    });

    this.ensureSuccess(response, "Unable to load followees.");

    const users = response.items
      .map((userDto) => User.fromDto(userDto))
      .filter((user): user is User => user !== null);

    return [users, response.hasMoreItems];
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastUser: User | null
  ): Promise<[User[], boolean]> {
    const response: PagedUserItemResponse = await this.serverFacade.getFollowers({
      authToken: {
        token: authToken.token,
        timestamp: authToken.timestamp,
      },
      userAlias,
      pageSize,
      lastItem: lastUser ? lastUser.dto : null,
    });

    this.ensureSuccess(response, "Unable to load followers.");

    const users = response.items
      .map((userDto) => User.fromDto(userDto))
      .filter((user): user is User => user !== null);

    return [users, response.hasMoreItems];
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const response: FollowStatusResponse =
      await this.serverFacade.getIsFollowerStatus({
        authToken: {
          token: authToken.token,
          timestamp: authToken.timestamp,
        },
        user: user.dto,
        selectedUser: selectedUser.dto,
      });

    this.ensureSuccess(response, "Unable to determine follower status.");

    return response.isFollower;
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const response: FollowCountResponse =
      await this.serverFacade.getFolloweeCount({
        authToken: {
          token: authToken.token,
          timestamp: authToken.timestamp,
        },
        user: user.dto,
      });

    this.ensureSuccess(response, "Unable to retrieve followee count.");

    return response.count;
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const response: FollowCountResponse =
      await this.serverFacade.getFollowerCount({
        authToken: {
          token: authToken.token,
          timestamp: authToken.timestamp,
        },
        user: user.dto,
      });

    this.ensureSuccess(response, "Unable to retrieve follower count.");

    return response.count;
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<void> {
    const response = await this.serverFacade.follow({
      authToken: {
        token: authToken.token,
        timestamp: authToken.timestamp,
      },
      targetUser: userToFollow.dto,
    });

    this.ensureSuccess(response, `Unable to follow ${userToFollow.alias}.`);
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<void> {
    const response = await this.serverFacade.unfollow({
      authToken: {
        token: authToken.token,
        timestamp: authToken.timestamp,
      },
      targetUser: userToUnfollow.dto,
    });

    this.ensureSuccess(response, `Unable to unfollow ${userToUnfollow.alias}.`);
  }

  private ensureSuccess(response: TweeterResponse, fallbackMessage: string): void {
    if (!response.success) {
      throw new Error(response.message ?? fallbackMessage);
    }
  }
}

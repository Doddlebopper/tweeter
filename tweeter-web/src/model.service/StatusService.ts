import {
  AuthToken,
  Status,
  type PagedStatusResponse,
  type PostStatusResponse,
  type TweeterResponse,
} from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";
import { Service } from "./Service";

export class StatusService implements Service {
  private readonly serverFacade = ServerFacade.getInstance();

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastStatus: Status | null
  ): Promise<[Status[], boolean]> {
    const response: PagedStatusResponse = await this.serverFacade.getFeed({
      authToken: {
        token: authToken.token,
        timestamp: authToken.timestamp,
      },
      userAlias,
      pageSize,
      lastItem: lastStatus ? lastStatus.dto : null,
    });

    this.ensureSuccess(response, "Unable to load feed items.");

    const statuses = response.statuses
      .map((statusDto) => Status.fromDto(statusDto))
      .filter((status): status is Status => status !== null);

    return [statuses, response.hasMoreItems];
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastStatus: Status | null
  ): Promise<[Status[], boolean]> {
    const response: PagedStatusResponse = await this.serverFacade.getStory({
      authToken: {
        token: authToken.token,
        timestamp: authToken.timestamp,
      },
      userAlias,
      pageSize,
      lastItem: lastStatus ? lastStatus.dto : null,
    });

    this.ensureSuccess(response, "Unable to load story items.");

    const statuses = response.statuses
      .map((statusDto) => Status.fromDto(statusDto))
      .filter((status): status is Status => status !== null);

    return [statuses, response.hasMoreItems];
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    const response: PostStatusResponse = await this.serverFacade.postStatus({
      authToken: {
        token: authToken.token,
        timestamp: authToken.timestamp,
      },
      status: newStatus.dto,
    });

    this.ensureSuccess(response, "Unable to post the new status.");
  }

  private ensureSuccess(response: TweeterResponse, fallbackMessage: string): void {
    if (!response.success) {
      throw new Error(response.message ?? fallbackMessage);
    }
  }
}

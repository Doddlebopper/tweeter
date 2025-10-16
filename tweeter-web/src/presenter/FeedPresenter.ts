import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";

export const PAGE_SIZE = 10;

export class FeedPresenter extends StatusItemPresenter {
    protected itemDescription(): string {
        return "load feed items";
    }
    protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
        return this.service.loadMoreFeedItems(authToken, userAlias, PAGE_SIZE, this.lastItem);
    }
}


import { FollowService } from "../model.service/FollowService";
import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { UserItemView } from "./UserItemPresenter";


export const PAGE_SIZE = 10;
export interface FolloweeView {
    addItems(items: User[]): void;
    displayErrorMessage: (message: string) => void;
}

export class FollowerPresenter extends UserItemPresenter {
    private service: FollowService;

    public constructor(view: UserItemView) {
        super(view);
        this.service = new FollowService();
    }

    public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    try {
      const [newItems, hasMore] = await this.service.loadMoreFollowers(
        authToken,
        userAlias,
        PAGE_SIZE,
        this.lastItem
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(
        `failed to load followers because of exception: ${error}`
      );
    }
  };

};
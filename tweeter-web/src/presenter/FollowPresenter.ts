import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { Presenter, MessageView } from "./Presenter";

export interface FollowView extends MessageView {
    setIsFollower: (isFollower: boolean) => void;
    setFolloweeCount: (count: number) => void;
    setFollowerCount: (count: number) => void;
    setIsLoading: (isLoading: boolean) => void;
}

export abstract class FollowPresenter extends Presenter<FollowView> {
    protected followService: FollowService;

    protected constructor(view: FollowView) {
        super(view);
        this.followService = new FollowService();
    }

    protected async performFollowOperation(
        operation: () => Promise<void>,
        isFollowing: boolean,
        authToken: AuthToken,
        displayedUser: User,
        operationDescription: string,
        toastMessage: string
    ) {
        let toastId = "";

        this.view.setIsLoading(true);
        toastId = this.view.displayInfoMessage(toastMessage, 0);

        await this.doFailureReportingOperation(async () => {
            await operation();

            const followerCount = await this.followService.getFollowerCount(authToken, displayedUser);
            const followeeCount = await this.followService.getFolloweeCount(authToken, displayedUser);

            this.view.setIsFollower(isFollowing);
            this.view.setFollowerCount(followerCount);
            this.view.setFolloweeCount(followeeCount);
        }, operationDescription);

        this.view.deleteMessage(toastId);
        this.view.setIsLoading(false);
    }

    protected async performStatusCheck(
        operation: () => Promise<boolean>,
        operationDescription: string
    ) {
        await this.doFailureReportingOperation(async () => {
            const result = await operation();
            this.view.setIsFollower(result);
        }, operationDescription);
    }

    protected async performCountOperation(
        operation: () => Promise<number>,
        setter: (count: number) => void,
        operationDescription: string
    ) {
        await this.doFailureReportingOperation(async () => {
            const count = await operation();
            setter(count);
        }, operationDescription);
    }
}

import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { Presenter, View } from "./Presenter";

export interface UserInfoView extends View {
    setIsFollower: (isFollower: boolean) => void;
    setFolloweeCount: (count: number) => void;
    setFollowerCount: (count: number) => void;
    setIsLoading: (isLoading: boolean) => void;
    displayInfoMessage: (message: string, duration: number) => string;
    deleteMessage: (messageId: string) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
    private followService: FollowService;

    public constructor(view: UserInfoView) {
        super(view);
        this.followService = new FollowService();
    }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ) {
        this.doFailureReportingOperation(async () => {
            if (currentUser === displayedUser) {
                this.view.setIsFollower(false);
            } else {
                const isFollower = await this.followService.getIsFollowerStatus(
                    authToken,
                    currentUser,
                    displayedUser
                );
                this.view.setIsFollower(isFollower);
            }
        }, "determine follower status");
    }

    public async setNumbFollowees(
        authToken: AuthToken,
        displayedUser: User
    ) {
        this.doFailureReportingOperation(async () => {
            const count = await this.followService.getFolloweeCount(authToken, displayedUser);
            this.view.setFolloweeCount(count);
        }, "get followees count");
    }

    public async setNumbFollowers(
        authToken: AuthToken,
        displayedUser: User
    ) {
        this.doFailureReportingOperation(async () => {
            const count = await this.followService.getFollowerCount(authToken, displayedUser);
            this.view.setFollowerCount(count);
        }, "get followers count");
    }

    public async followDisplayedUser(
        authToken: AuthToken,
        displayedUser: User
    ) {
        let followingUserToast = "";

        this.view.setIsLoading(true);
        followingUserToast = this.view.displayInfoMessage(`Following ${displayedUser.name}...`, 0);

        this.doFailureReportingOperation(async () => {
            await this.followService.follow(authToken, displayedUser);

            const followerCount = await this.followService.getFollowerCount(authToken, displayedUser);
            const followeeCount = await this.followService.getFolloweeCount(authToken, displayedUser);

            this.view.setIsFollower(true);
            this.view.setFollowerCount(followerCount);
            this.view.setFolloweeCount(followeeCount);
        }, "follow user");

        this.view.deleteMessage(followingUserToast);
        this.view.setIsLoading(false);
    }

    public async unfollowDisplayedUser(
        authToken: AuthToken,
        displayedUser: User
    ) {
        let unfollowingUserToast = "";

        this.view.setIsLoading(true);
        unfollowingUserToast = this.view.displayInfoMessage(`Unfollowing ${displayedUser.name}...`, 0);

        this.doFailureReportingOperation(async () => {
            await this.followService.unfollow(authToken, displayedUser);

            const followerCount = await this.followService.getFollowerCount(authToken, displayedUser);
            const followeeCount = await this.followService.getFolloweeCount(authToken, displayedUser);

            this.view.setIsFollower(false);
            this.view.setFollowerCount(followerCount);
            this.view.setFolloweeCount(followeeCount);
        }, "unfollow user");

        this.view.deleteMessage(unfollowingUserToast);
        this.view.setIsLoading(false);
    }
}


import { AuthToken, User } from "tweeter-shared";
import { FollowPresenter, FollowView } from "./FollowPresenter";

export interface UserInfoView extends FollowView {}

export class UserInfoPresenter extends FollowPresenter {
    public constructor(view: UserInfoView) {
        super(view);
    }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ) {
        if (currentUser === displayedUser) {
            this.view.setIsFollower(false);
        } else {
            await this.performStatusCheck(
                () => this.followService.getIsFollowerStatus(authToken, currentUser, displayedUser),
                "determine follower status"
            );
        }
    }

    public async setNumbFollowees(
        authToken: AuthToken,
        displayedUser: User
    ) {
        await this.performCountOperation(
            () => this.followService.getFolloweeCount(authToken, displayedUser),
            (count) => this.view.setFolloweeCount(count),
            "get followees count"
        );
    }

    public async setNumbFollowers(
        authToken: AuthToken,
        displayedUser: User
    ) {
        await this.performCountOperation(
            () => this.followService.getFollowerCount(authToken, displayedUser),
            (count) => this.view.setFollowerCount(count),
            "get followers count"
        );
    }

    public async followDisplayedUser(
        authToken: AuthToken,
        displayedUser: User
    ) {
        await this.performFollowOperation(
            () => this.followService.follow(authToken, displayedUser),
            true,
            authToken,
            displayedUser,
            "follow user",
            `Following ${displayedUser.name}...`
        );
    }

    public async unfollowDisplayedUser(
        authToken: AuthToken,
        displayedUser: User
    ) {
        await this.performFollowOperation(
            () => this.followService.unfollow(authToken, displayedUser),
            false,
            authToken,
            displayedUser,
            "unfollow user",
            `Unfollowing ${displayedUser.name}...`
        );
    }
}


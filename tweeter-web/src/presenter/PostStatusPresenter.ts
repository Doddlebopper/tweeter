import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";

export interface PostStatusView {
    setIsLoading: (isLoading: boolean) => void;
    setPost: (post: string) => void;
    displayInfoMessage: (message: string, duration: number) => string;
    deleteMessage: (messageId: string) => void;
    displayErrorMessage: (message: string) => void;
}

export class PostStatusPresenter {
    private statusService: StatusService;
    private _view: PostStatusView;

    public constructor(view: PostStatusView) {
        this._view = view;
        this.statusService = new StatusService();
    }

    protected get view(): PostStatusView {
        return this._view;
    }

    public async submitPost(post: string, currentUser: User, authToken: AuthToken) {
        let postingStatusToastId = "";

        try {
            this.view.setIsLoading(true);
            postingStatusToastId = this.view.displayInfoMessage("Posting status...", 0);

            const status = new Status(post, currentUser, Date.now());

            await this.statusService.postStatus(authToken, status);

            this.view.setPost("");
            this.view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
            this.view.displayErrorMessage(`Failed to post the status because of exception: ${error}`);
        } finally {
            this.view.deleteMessage(postingStatusToastId);
            this.view.setIsLoading(false);
        }
    }
}


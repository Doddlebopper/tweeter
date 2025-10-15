import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { Presenter, View } from "./Presenter";

export interface PostStatusView extends View {
    setIsLoading: (isLoading: boolean) => void;
    setPost: (post: string) => void;
    displayInfoMessage: (message: string, duration: number) => string;
    deleteMessage: (messageId: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
    private statusService: StatusService;

    public constructor(view: PostStatusView) {
        super(view);
        this.statusService = new StatusService();
    }

    public async submitPost(post: string, currentUser: User, authToken: AuthToken) {
        let postingStatusToastId = "";

        this.view.setIsLoading(true);
        postingStatusToastId = this.view.displayInfoMessage("Posting status...", 0);

        this.doFailureReportingOperation(async () => {
            const status = new Status(post, currentUser, Date.now());

            await this.statusService.postStatus(authToken, status);

            this.view.setPost("");
            this.view.displayInfoMessage("Status posted!", 2000);
        }, "post the status");

        this.view.deleteMessage(postingStatusToastId);
        this.view.setIsLoading(false);
    }
}


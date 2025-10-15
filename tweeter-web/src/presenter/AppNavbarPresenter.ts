import { AuthToken } from "tweeter-shared";
import { AuthenticationService } from "../model.service/AuthenticationService";
import { Presenter, View } from "./Presenter";

export interface AppNavbarView extends View {
    displayInfoMessage: (message: string, duration: number) => string;
    deleteMessage: (messageId: string) => void;
    clearUserInfo: () => void;
    navigate: (path: string) => void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
    private authenticationService: AuthenticationService;

    public constructor(view: AppNavbarView) {
        super(view);
        this.authenticationService = new AuthenticationService();
    }

    public async logOut(authToken: AuthToken) {
        const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

        this.doFailureReportingOperation(async () => {
            await this.authenticationService.logout(authToken);

            this.view.deleteMessage(loggingOutToastId);
            this.view.clearUserInfo();
            this.view.navigate("/login");
        }, "log user out");
    }
}


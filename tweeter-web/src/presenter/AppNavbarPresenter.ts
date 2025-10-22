import { AuthToken } from "tweeter-shared";
import { AuthenticationService } from "../model.service/AuthenticationService";
import { Presenter, MessageView } from "./Presenter";

export interface AppNavbarView extends MessageView {
    clearUserInfo: () => void;
    navigate: (path: string) => void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
    private authenticationService: AuthenticationService;

    public constructor(view: AppNavbarView, authenticationService?: AuthenticationService) {
        super(view);
        this.authenticationService = authenticationService ?? new AuthenticationService();
    }

    public get service(): any {
        return this.authenticationService;
    }

    public async logOut(authToken: AuthToken) {
        const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

        await this.doFailureReportingOperation(async () => {
            await this.authenticationService.logout(authToken);

            this.view.deleteMessage(loggingOutToastId);
            this.view.clearUserInfo();
            this.view.navigate("/login");
        }, "log user out");
    }
}


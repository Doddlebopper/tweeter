import { AuthToken } from "tweeter-shared";
import { AuthenticationService } from "../model.service/AuthenticationService";

export interface AppNavbarView {
    displayInfoMessage: (message: string, duration: number) => string;
    deleteMessage: (messageId: string) => void;
    displayErrorMessage: (message: string) => void;
    clearUserInfo: () => void;
    navigate: (path: string) => void;
}

export class AppNavbarPresenter {
    private authenticationService: AuthenticationService;
    private _view: AppNavbarView;

    public constructor(view: AppNavbarView) {
        this._view = view;
        this.authenticationService = new AuthenticationService();
    }

    protected get view(): AppNavbarView {
        return this._view;
    }

    public async logOut(authToken: AuthToken) {
        const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

        try {
            await this.authenticationService.logout(authToken);

            this.view.deleteMessage(loggingOutToastId);
            this.view.clearUserInfo();
            this.view.navigate("/login");
        } catch (error) {
            this.view.displayErrorMessage(`Failed to log user out because of exception: ${error}`);
        }
    }
}


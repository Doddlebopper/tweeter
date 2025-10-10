import { AuthToken, User } from "tweeter-shared";
import { AuthenticationService } from "../model.service/AuthenticationService";

export interface LoginView {
    setIsLoading: (isLoading: boolean) => void;
    updateUserInfo: (currentUser: User, displayedUser: User, authToken: AuthToken, rememberMe: boolean) => void;
    navigate: (path: string) => void;
    displayErrorMessage: (message: string) => void;
}

export class LoginPresenter {
    private authenticationService: AuthenticationService;
    private _view: LoginView;

    public constructor(view: LoginView) {
        this._view = view;
        this.authenticationService = new AuthenticationService();
    }

    protected get view(): LoginView {
        return this._view;
    }

    public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl?: string) {
        try {
            this.view.setIsLoading(true);

            const [user, authToken] = await this.authenticationService.login(alias, password);

            this.view.updateUserInfo(user, user, authToken, rememberMe);

            if (originalUrl) {
                this.view.navigate(originalUrl);
            } else {
                this.view.navigate(`/feed/${user.alias}`);
            }
        } catch (error) {
            this.view.displayErrorMessage(`Failed to log user in because of exception: ${error}`);
        } finally {
            this.view.setIsLoading(false);
        }
    }
}


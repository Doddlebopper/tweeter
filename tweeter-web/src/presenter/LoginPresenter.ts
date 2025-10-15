import { AuthToken, User } from "tweeter-shared";
import { AuthenticationService } from "../model.service/AuthenticationService";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
    setIsLoading: (isLoading: boolean) => void;
    updateUserInfo: (currentUser: User, displayedUser: User, authToken: AuthToken, rememberMe: boolean) => void;
    navigate: (path: string) => void;
}

export class LoginPresenter extends Presenter<LoginView> {
    private authenticationService: AuthenticationService;

    public constructor(view: LoginView) {
        super(view);
        this.authenticationService = new AuthenticationService();
    }

    public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl?: string) {
        this.view.setIsLoading(true);

        this.doFailureReportingOperation(async () => {
            const [user, authToken] = await this.authenticationService.login(alias, password);

            this.view.updateUserInfo(user, user, authToken, rememberMe);

            if (originalUrl) {
                this.view.navigate(originalUrl);
            } else {
                this.view.navigate(`/feed/${user.alias}`);
            }
        }, "log user in");

        this.view.setIsLoading(false);
    }
}


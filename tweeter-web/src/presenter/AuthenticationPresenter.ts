import { AuthToken, User } from "tweeter-shared";
import { AuthenticationService } from "../model.service/AuthenticationService";
import { Presenter, View } from "./Presenter";

export interface AuthenticationView extends View {
    setIsLoading: (isLoading: boolean) => void;
    updateUserInfo: (currentUser: User, displayedUser: User, authToken: AuthToken, rememberMe: boolean) => void;
    navigate: (path: string) => void;
}

export abstract class AuthenticationPresenter extends Presenter<AuthenticationView> {
    protected authenticationService: AuthenticationService;

    protected constructor(view: AuthenticationView) {
        super(view);
        this.authenticationService = new AuthenticationService();
    }

    protected async performAuthentication(
        operation: () => Promise<[User, AuthToken]>,
        rememberMe: boolean,
        originalUrl?: string
    ) {
        this.view.setIsLoading(true);

        await this.doFailureReportingOperation(async () => {
            const [user, authToken] = await operation();

            this.view.updateUserInfo(user, user, authToken, rememberMe);

            if (originalUrl) {
                this.view.navigate(originalUrl);
            } else {
                this.view.navigate(`/feed/${user.alias}`);
            }
        }, this.getOperationDescription());

        this.view.setIsLoading(false);
    }

    protected abstract getOperationDescription(): string;
}

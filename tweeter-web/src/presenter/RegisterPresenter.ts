import { AuthToken, User } from "tweeter-shared";
import { AuthenticationService } from "../model.service/AuthenticationService";

export interface RegisterView {
    setIsLoading: (isLoading: boolean) => void;
    updateUserInfo: (currentUser: User, displayedUser: User, authToken: AuthToken, rememberMe: boolean) => void;
    navigate: (path: string) => void;
    displayErrorMessage: (message: string) => void;
}

export class RegisterPresenter {
    private authenticationService: AuthenticationService;
    private _view: RegisterView;

    public constructor(view: RegisterView) {
        this._view = view;
        this.authenticationService = new AuthenticationService();
    }

    protected get view(): RegisterView {
        return this._view;
    }

    public async doRegister(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageBytes: Uint8Array,
        imageFileExtension: string,
        rememberMe: boolean
    ) {
        try {
            this.view.setIsLoading(true);

            const [user, authToken] = await this.authenticationService.register(
                firstName,
                lastName,
                alias,
                password,
                imageBytes,
                imageFileExtension
            );

            this.view.updateUserInfo(user, user, authToken, rememberMe);
            this.view.navigate(`/feed/${user.alias}`);
        } catch (error) {
            this.view.displayErrorMessage(`Failed to register user because of exception: ${error}`);
        } finally {
            this.view.setIsLoading(false);
        }
    }
}


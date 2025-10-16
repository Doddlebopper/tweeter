import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface LoginView extends AuthenticationView {}

export class LoginPresenter extends AuthenticationPresenter {
    public constructor(view: LoginView) {
        super(view);
    }

    public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl?: string) {
        await this.performAuthentication(
            () => this.authenticationService.login(alias, password),
            rememberMe,
            originalUrl
        );
    }

    protected getOperationDescription(): string {
        return "log user in";
    }
}


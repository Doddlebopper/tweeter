import { Buffer } from "buffer";
import {
  AuthToken,
  User,
  type LoginResponse,
  type RegisterResponse,
  type TweeterResponse,
} from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";
import { Service } from "./Service";

export class AuthenticationService implements Service {
  private readonly serverFacade = ServerFacade.getInstance();

  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
    const response: LoginResponse = await this.serverFacade.login({ alias, password });
    this.ensureSuccess(response, "Unable to login at this time.");

    if (!response.user || !response.authToken) {
      throw new Error("Login succeeded but user data was missing from the server response.");
    }

    const user = User.fromDto(response.user);
    if (!user) {
      throw new Error("Login succeeded but user data was malformed.");
    }

    const authToken = new AuthToken(
      response.authToken.token,
      response.authToken.timestamp
    );

    return [user, authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const imageStringBase64 = Buffer.from(userImageBytes).toString("base64");

    const response: RegisterResponse = await this.serverFacade.register({
      firstName,
      lastName,
      alias,
      password,
      imageStringBase64,
      imageFileExtension,
    });

    this.ensureSuccess(response, "Unable to register at this time.");

    if (!response.user || !response.authToken) {
      throw new Error("Registration succeeded but user data was missing from the server response.");
    }

    const user = User.fromDto(response.user);
    if (!user) {
      throw new Error("Registration succeeded but user data was malformed.");
    }

    const authToken = new AuthToken(
      response.authToken.token,
      response.authToken.timestamp
    );

    return [user, authToken];
  }

  public async logout(authToken: AuthToken): Promise<void> {
    const response = await this.serverFacade.logout({
      authToken: {
        token: authToken.token,
        timestamp: authToken.timestamp,
      },
    });

    this.ensureSuccess(response, "Unable to logout at this time.");
  }

  private ensureSuccess(response: TweeterResponse, fallbackMessage: string): void {
    if (!response.success) {
      throw new Error(response.message ?? fallbackMessage);
    }
  }
}

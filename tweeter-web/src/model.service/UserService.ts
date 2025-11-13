import {
  AuthToken,
  User,
  type GetUserResponse,
  type TweeterResponse,
} from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";
import { Service } from "./Service";

export class UserService implements Service {
  private readonly serverFacade = ServerFacade.getInstance();

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    const response: GetUserResponse = await this.serverFacade.getUser({
      authToken: {
        token: authToken.token,
        timestamp: authToken.timestamp,
      },
      alias,
    });

    this.ensureSuccess(response, "Unable to retrieve user information.");

    if (!response.user) {
      return null;
    }

    return User.fromDto(response.user);
  }

  private ensureSuccess(response: TweeterResponse, fallbackMessage: string): void {
    if (!response.success) {
      throw new Error(response.message ?? fallbackMessage);
    }
  }
}

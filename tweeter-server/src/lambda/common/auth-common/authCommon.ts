import { AuthToken, type AuthTokenDto, type LoginResponse, type RegisterResponse, type TweeterResponse, User } from "tweeter-shared";
import { createFailureResponse, createSuccessResponse } from "../responses-common/responsesCommon";

type AuthResponse = LoginResponse | RegisterResponse;

const emptyAuthPayload = {
  user: null,
  authToken: null,
};

export const buildAuthFailureResponse = <T extends AuthResponse>(
  message: string
): T =>
  createFailureResponse(message, emptyAuthPayload) as T;

export const buildAuthSuccessResponse = <T extends AuthResponse>(
  user: User,
  authToken: AuthToken
): T =>
  createSuccessResponse({
    user: user.dto,
    authToken: {
      token: authToken.token,
      timestamp: authToken.timestamp,
    },
  }) as T;

export const buildTweeterFailureResponse = (
  message: string
): TweeterResponse => createFailureResponse(message, {});

export const toAuthToken = (
  tokenDto: AuthTokenDto | null | undefined
): AuthToken | null =>
  tokenDto ? new AuthToken(tokenDto.token, tokenDto.timestamp) : null;


import type { AuthTokenDto } from "../../dto/AuthTokenDto";
import type { UserDto } from "../../dto/UserDto";

export interface AuthenticatedRequest {
  readonly authToken: AuthTokenDto;
}

export interface AuthenticatedUserRequest extends AuthenticatedRequest {
  readonly user: UserDto;
}

export interface AuthenticatedUserPairRequest
  extends AuthenticatedUserRequest {
  readonly selectedUser: UserDto;
}

export interface AuthenticatedUserTargetRequest
  extends AuthenticatedRequest {
  readonly targetUser: UserDto;
}


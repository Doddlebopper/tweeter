import type { AuthenticatedRequest } from "../auth-common/AuthRequests";

export type GetUserRequest = AuthenticatedRequest & {
  readonly alias: string;
};


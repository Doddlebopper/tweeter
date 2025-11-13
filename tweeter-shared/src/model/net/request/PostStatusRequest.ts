import type { StatusDto } from "../../dto/StatusDto";
import type { AuthenticatedRequest } from "../auth-common/AuthRequests";

export type PostStatusRequest = AuthenticatedRequest & {
  readonly status: StatusDto;
};


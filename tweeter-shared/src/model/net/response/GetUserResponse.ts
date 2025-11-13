import type { UserDto } from "../../dto/UserDto";
import type { WithPayload } from "../paged-common/PageRequests";
import type { TweeterResponse } from "./TweeterResponse";

export type GetUserResponse = TweeterResponse &
  WithPayload<"user", UserDto | null>;


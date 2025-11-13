import type { AuthTokenDto } from "../../dto/AuthTokenDto";
import type { UserDto } from "../../dto/UserDto";
import type { WithPayload } from "../paged-common/PageRequests";
import type { TweeterResponse } from "./TweeterResponse";

export type LoginResponse = TweeterResponse &
  WithPayload<"user", UserDto | null> &
  WithPayload<"authToken", AuthTokenDto | null>;


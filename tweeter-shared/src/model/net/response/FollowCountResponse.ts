import type { WithPayload } from "../paged-common/PageRequests";
import type { TweeterResponse } from "./TweeterResponse";

export type FollowCountResponse = TweeterResponse &
  WithPayload<"count", number>;


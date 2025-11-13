import type { WithPayload } from "../paged-common/PageRequests";
import type { TweeterResponse } from "./TweeterResponse";

export type FollowStatusResponse = TweeterResponse &
  WithPayload<"isFollower", boolean>;


import { User, type FollowCountResponse, type FollowStatusResponse, type PagedUserItemResponse, type TweeterResponse, type UserDto } from "tweeter-shared";
import { createFailureResponse } from "../responses-common/responsesCommon";

const emptyPagedUserPayload = {
  items: [] as PagedUserItemResponse["items"],
  hasMoreItems: false,
};

export const buildPagedUsersFailureResponse = (
  message: string
): PagedUserItemResponse =>
  createFailureResponse(message, emptyPagedUserPayload);

export const buildFollowCountFailureResponse = (
  message: string
): FollowCountResponse => createFailureResponse(message, { count: 0 });

export const buildFollowActionFailureResponse = (
  message: string
): TweeterResponse => createFailureResponse(message, {});

export const buildFollowStatusFailureResponse = (
  message: string
): FollowStatusResponse => createFailureResponse(message, { isFollower: false });

export const toUser = (userDto?: UserDto | null): User | null =>
  User.fromDto(userDto ?? null);


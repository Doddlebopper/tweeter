import { Status, type PagedStatusResponse, type PostStatusResponse, type StatusDto } from "tweeter-shared";
import { createFailureResponse } from "../responses-common/responsesCommon";

const emptyPagedStatusPayload = {
  statuses: [] as PagedStatusResponse["statuses"],
  hasMoreItems: false,
};

export const buildPagedStatusFailureResponse = (
  message: string
): PagedStatusResponse =>
  createFailureResponse(message, emptyPagedStatusPayload);

export const toStatus = (statusDto?: StatusDto | null): Status | null =>
  Status.fromDto(statusDto ?? null);

export const buildPostStatusFailureResponse = (
  message: string
): PostStatusResponse => createFailureResponse(message, {});


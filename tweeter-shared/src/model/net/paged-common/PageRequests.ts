import type { AuthenticatedRequest } from "../auth-common/AuthRequests";
import type { TweeterResponse } from "../response/TweeterResponse";

export type WithPayload<TKey extends string, TValue> = {
  readonly [Key in TKey]: TValue;
};

export interface PagedItemsRequest<TItem> extends AuthenticatedRequest {
  readonly userAlias: string;
  readonly pageSize: number;
  readonly lastItem: TItem | null;
}

export type PagedItemsResponse<
  TItem,
  TKey extends string
> = TweeterResponse &
  WithPayload<TKey, readonly TItem[]> & {
    readonly hasMoreItems: boolean;
  };


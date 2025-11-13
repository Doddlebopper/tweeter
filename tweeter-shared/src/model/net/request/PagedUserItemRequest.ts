import type { UserDto } from "../../dto/UserDto";
import type { PagedItemsRequest } from "../paged-common/PageRequests";

export type PagedUserItemRequest = PagedItemsRequest<UserDto>;
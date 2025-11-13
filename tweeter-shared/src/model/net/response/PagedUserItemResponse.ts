import type { UserDto } from "../../dto/UserDto";
import type { PagedItemsResponse } from "../paged-common/PageRequests";

export type PagedUserItemResponse = PagedItemsResponse<UserDto, "items">;
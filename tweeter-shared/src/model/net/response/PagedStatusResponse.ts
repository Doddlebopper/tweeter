import type { StatusDto } from "../../dto/StatusDto";
import type { PagedItemsResponse } from "../paged-common/PageRequests";

export type PagedStatusResponse = PagedItemsResponse<StatusDto, "statuses">;


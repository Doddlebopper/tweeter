import type { StatusDto } from "../../dto/StatusDto";
import type { PagedItemsRequest } from "../paged-common/PageRequests";

export type PagedStatusRequest = PagedItemsRequest<StatusDto>;


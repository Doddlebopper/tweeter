import { AuthToken, FakeData, Status } from "tweeter-shared";
import { Service } from "tweeter-web/src/model.service/Service";
import { pause } from "./service-common/serviceCommon";

export class StatusService implements Service {
    public async loadMoreFeedItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastStatus: Status | null
    ): Promise<[Status[], boolean]> {
        // TODO: Replace with the result of calling server
        return this.getStatusesPage(lastStatus, pageSize);
    }

    public async loadMoreStoryItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastStatus: Status | null
    ): Promise<[Status[], boolean]> {
        // TODO: Replace with the result of calling server
        return this.getStatusesPage(lastStatus, pageSize);
    }

    public async postStatus(
        authToken: AuthToken,
        newStatus: Status
    ): Promise<void> {
        // Pause so we can see the posting status message. Remove when connected to the server
        await pause(2000);

        // TODO: Call the server to post the status
    }

    private getStatusesPage(
        lastStatus: Status | null,
        pageSize: number
    ): [Status[], boolean] {
        return FakeData.instance.getPageOfStatuses(lastStatus, pageSize);
    }
}; 
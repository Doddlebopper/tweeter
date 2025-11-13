import { FakeData, Status } from "tweeter-shared";
import { StatusService } from "../../../src/model.service/StatusService";
import { createServerFacade } from "../serverFacade/ServerFacadeTestUtils";
import { ServerFacade } from "../../../src/network/ServerFacade";

jest.setTimeout(30000);

describe("StatusService integration", () => {
  beforeAll(() => {
    const facade = createServerFacade();
    ServerFacade.configure({ communicator: (facade as unknown as { clientCommunicator: any }).clientCommunicator });
  });

  it("loads a user's story page from the backend", async () => {
    const authToken = FakeData.instance.authToken;
    const user = FakeData.instance.firstUser;

    expect(user).not.toBeNull();
    if (!user) {
      throw new Error("Fake data did not provide a first user.");
    }

    const statusService = new StatusService();
    const [statuses, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      user.alias,
      5,
      null
    );

    expect(Array.isArray(statuses)).toBe(true);
    statuses.forEach((status) => {
      expect(status).toBeInstanceOf(Status);
      expect(status.user.alias).toBeDefined();
      expect(status.post).not.toHaveLength(0);
    });

    expect(typeof hasMore).toBe("boolean");
  });
});



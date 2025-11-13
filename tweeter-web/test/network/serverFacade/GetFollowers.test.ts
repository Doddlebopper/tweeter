import { FakeData } from "tweeter-shared";
import { createServerFacade } from "./ServerFacadeTestUtils";

jest.setTimeout(30000);

describe("ServerFacade.getFollowers integration", () => {
  const serverFacade = createServerFacade();

  it("retrieves followers from the backend", async () => {
    const authToken = FakeData.instance.authToken;
    const targetUser = FakeData.instance.firstUser;

    expect(targetUser).not.toBeNull();
    if (!targetUser) {
      throw new Error("Fake data did not provide a first user.");
    }

    const response = await serverFacade.getFollowers({
      authToken: {
        token: authToken.token,
        timestamp: authToken.timestamp,
      },
      userAlias: targetUser.alias,
      pageSize: 5,
      lastItem: null,
    });

    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
    expect(response.items.length).toBeGreaterThan(0);
    expect(response.items.length).toBeLessThanOrEqual(5);
    expect(
      response.items.every((item) => item.alias !== targetUser.alias)
    ).toBe(true);
  });
});


import { FakeData } from "tweeter-shared";
import { createServerFacade } from "./ServerFacadeTestUtils";

jest.setTimeout(30000);

describe("ServerFacade follower count integration", () => {
  const serverFacade = createServerFacade();

  const buildRequest = () => {
    const authToken = FakeData.instance.authToken;
    const user = FakeData.instance.firstUser;

    expect(user).not.toBeNull();
    if (!user) {
      throw new Error("Fake data did not provide a first user.");
    }

    return {
      authToken: {
        token: authToken.token,
        timestamp: authToken.timestamp,
      },
      user: user.dto,
    };
  };

  it("retrieves follower count from the backend", async () => {
    const response = await serverFacade.getFollowerCount(buildRequest());

    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
    expect(response.count).toBeGreaterThanOrEqual(0);
  });

  it("retrieves followee count from the backend", async () => {
    const response = await serverFacade.getFolloweeCount(buildRequest());

    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
    expect(response.count).toBeGreaterThanOrEqual(0);
  });
});


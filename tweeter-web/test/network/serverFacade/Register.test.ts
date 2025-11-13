import { FakeData } from "tweeter-shared";
import { createServerFacade } from "./ServerFacadeTestUtils";

jest.setTimeout(30000);

describe("ServerFacade.register integration", () => {
  const serverFacade = createServerFacade();

  it("registers a user via the backend", async () => {
    const uniqueAlias = `@integration-${Date.now()}`;
    const base64Image =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=";

    const response = await serverFacade.register({
      firstName: "Integration",
      lastName: "Tester",
      alias: uniqueAlias,
      password: "password",
      imageStringBase64: base64Image,
      imageFileExtension: "png",
    });

    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
    expect(response.user).not.toBeNull();
    expect(response.authToken).not.toBeNull();

    const expectedUser = FakeData.instance.firstUser;
    expect(expectedUser).not.toBeNull();
    if (expectedUser) {
      expect(response.user?.alias).toBe(expectedUser.alias);
    }

    expect(response.authToken?.token).toBeDefined();
    expect(response.authToken?.token).not.toHaveLength(0);
  });
});


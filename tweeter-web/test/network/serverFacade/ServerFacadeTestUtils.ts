import fetch from "cross-fetch";
import { ServerFacade } from "../../../src/network/ServerFacade";

const globalScope = globalThis as unknown as {
  fetch?: typeof globalThis.fetch;
  __TWEETER_API_URL__?: string;
  process?: { env?: Record<string, string | undefined> };
};

if (!globalScope.fetch) {
  globalScope.fetch = fetch as unknown as typeof globalThis.fetch;
}

const getEnv = (): Record<string, string | undefined> => {
  return globalScope.process?.env ?? {};
};

const DEFAULT_TEST_BASE_URL = "http://localhost";

export const createServerFacade = (): ServerFacade => {
  const env = getEnv();
  const baseUrl =
    env.TWEETER_API_URL ??
    env.REACT_APP_TWEETER_API_URL ??
    env.VITE_TWEETER_API_URL ??
    globalScope.__TWEETER_API_URL__ ??
    DEFAULT_TEST_BASE_URL;

  globalScope.__TWEETER_API_URL__ = baseUrl;
  return ServerFacade.configure({ baseUrl });
};


export class ClientCommunicator {
  private readonly baseUrl: string;

  public constructor(baseUrl?: string) {
    const globalScope = globalThis as {
      __TWEETER_API_URL__?: string;
      process?: { env?: Record<string, string | undefined> };
    };

    const envBaseUrl =
      globalScope.__TWEETER_API_URL__ ??
      globalScope.process?.env?.TWEETER_API_URL ??
      globalScope.process?.env?.REACT_APP_TWEETER_API_URL ??
      globalScope.process?.env?.VITE_TWEETER_API_URL;

    this.baseUrl = baseUrl ?? envBaseUrl ?? "http://localhost:3000";
  }

  public async post<TRequest, TResponse>(
    endpoint: string,
    body: TRequest
  ): Promise<TResponse> {
    return this.sendRequest<TRequest, TResponse>("POST", endpoint, body);
  }

  private async sendRequest<TRequest, TResponse>(
    method: "POST",
    endpoint: string,
    body: TRequest
  ): Promise<TResponse> {
    const url = this.buildUrl(endpoint);

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseBody = await this.readBody<TResponse | { message?: string }>(
      response
    );

    if (!response.ok) {
      const message =
        typeof responseBody === "object" && responseBody !== null && "message" in responseBody
          ? String(responseBody.message)
          : `Request to ${endpoint} failed with status ${response.status}`;

      throw new Error(message);
    }

    return responseBody as TResponse;
  }

  private buildUrl(endpoint: string): string {
    const trimmedBase = this.baseUrl.replace(/\/+$/, "");
    const trimmedEndpoint = endpoint.replace(/^\/+/, "");
    return `${trimmedBase}/${trimmedEndpoint}`;
  }

  private async readBody<T>(response: Response): Promise<T> {
    const contentLength = response.headers.get("content-length");
    if (contentLength === "0" || response.status === 204) {
      return {} as T;
    }

    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    return JSON.parse(text) as T;
  }
}
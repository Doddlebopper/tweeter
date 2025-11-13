import type {
  FollowActionRequest,
  FollowCountRequest,
  FollowCountResponse,
  FollowStatusRequest,
  FollowStatusResponse,
  GetUserRequest,
  GetUserResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  PagedStatusRequest,
  PagedStatusResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  PostStatusResponse,
  RegisterRequest,
  RegisterResponse,
  TweeterResponse,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

const ENDPOINTS = {
  login: "login",
  register: "register",
  logout: "logout",
  followees: "followee",
  followers: "follower/list",
  followeeCount: "followeeCount",
  followerCount: "followerCount",
  followStatus: "followerStatus",
  follow: "follow",
  unfollow: "unfollow",
  feed: "loadFeed",
  story: "loadStory",
  postStatus: "postStatus",
  user: "getUser",
} as const;

export class ServerFacade {
  private static instance: ServerFacade | null = null;
  private readonly clientCommunicator: ClientCommunicator;

  private constructor(communicator?: ClientCommunicator) {
    this.clientCommunicator = communicator ?? new ClientCommunicator();
  }

  public static configure(options: {
    baseUrl?: string;
    communicator?: ClientCommunicator;
  }): ServerFacade {
    const communicator =
      options.communicator ?? new ClientCommunicator(options.baseUrl);

    ServerFacade.instance = new ServerFacade(communicator);
    return ServerFacade.instance;
  }

  public static getInstance(): ServerFacade {
    if (!ServerFacade.instance) {
      const globalScope = globalThis as {
        __TWEETER_API_URL__?: string;
      };

      const defaultBaseUrl = globalScope.__TWEETER_API_URL__;

      ServerFacade.instance = new ServerFacade(
        new ClientCommunicator(defaultBaseUrl)
      );
    }

    return ServerFacade.instance;
  }

  public async login(request: LoginRequest): Promise<LoginResponse> {
    return this.clientCommunicator.post<LoginRequest, LoginResponse>(
      ENDPOINTS.login,
      request
    );
  }

  public async register(request: RegisterRequest): Promise<RegisterResponse> {
    return this.clientCommunicator.post<RegisterRequest, RegisterResponse>(
      ENDPOINTS.register,
      request
    );
  }

  public async logout(request: LogoutRequest): Promise<TweeterResponse> {
    return this.clientCommunicator.post<LogoutRequest, TweeterResponse>(
      ENDPOINTS.logout,
      request
    );
  }

  public async getFollowees(
    request: PagedUserItemRequest
  ): Promise<PagedUserItemResponse> {
    return this.clientCommunicator.post<PagedUserItemRequest,PagedUserItemResponse>(ENDPOINTS.followees, request);
  }

  public async getFollowers(
    request: PagedUserItemRequest
  ): Promise<PagedUserItemResponse> {
    return this.clientCommunicator.post<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(ENDPOINTS.followers, request);
  }

  public async getIsFollowerStatus(
    request: FollowStatusRequest
  ): Promise<FollowStatusResponse> {
    return this.clientCommunicator.post<
      FollowStatusRequest,
      FollowStatusResponse
    >(ENDPOINTS.followStatus, request);
  }

  public async getFolloweeCount(
    request: FollowCountRequest
  ): Promise<FollowCountResponse> {
    return this.clientCommunicator.post<
      FollowCountRequest,
      FollowCountResponse
    >(ENDPOINTS.followeeCount, request);
  }

  public async getFollowerCount(
    request: FollowCountRequest
  ): Promise<FollowCountResponse> {
    return this.clientCommunicator.post<
      FollowCountRequest,
      FollowCountResponse
    >(ENDPOINTS.followerCount, request);
  }

  public async follow(request: FollowActionRequest): Promise<TweeterResponse> {
    return this.clientCommunicator.post<FollowActionRequest, TweeterResponse>(
      ENDPOINTS.follow,
      request
    );
  }

  public async unfollow(
    request: FollowActionRequest
  ): Promise<TweeterResponse> {
    return this.clientCommunicator.post<FollowActionRequest, TweeterResponse>(
      ENDPOINTS.unfollow,
      request
    );
  }

  public async getFeed(
    request: PagedStatusRequest
  ): Promise<PagedStatusResponse> {
    return this.clientCommunicator.post<PagedStatusRequest, PagedStatusResponse>(
      ENDPOINTS.feed,
      request
    );
  }

  public async getStory(
    request: PagedStatusRequest
  ): Promise<PagedStatusResponse> {
    return this.clientCommunicator.post<PagedStatusRequest, PagedStatusResponse>(
      ENDPOINTS.story,
      request
    );
  }

  public async postStatus(
    request: PostStatusRequest
  ): Promise<PostStatusResponse> {
    return this.clientCommunicator.post<PostStatusRequest, PostStatusResponse>(
      ENDPOINTS.postStatus,
      request
    );
  }

  public async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    return this.clientCommunicator.post<GetUserRequest, GetUserResponse>(
      ENDPOINTS.user,
      request
    );
  }
}


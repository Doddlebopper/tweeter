import "./App.css";
import { useContext } from "react";
import { useUserInfo } from "./components/userInfo/UserInfoHooks";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
//import FolloweesScroller from "./components/mainLayout/FolloweesScroller";
//import FollowersScroller from "./components/mainLayout/FollowersScroller";
import StatusItemScroller, { loadMoreFollowees, loadMoreFollowers } from "./components/mainLayout/StatusItemScroller";
import { AuthToken, FakeData, Status } from "tweeter-shared";

const loadMoreFeedItems = async (
  authToken: AuthToken,
  userAlias: string,
  pageSize: number,
  lastItem: Status | null
): Promise<[Status[], boolean]> => {
  // TODO: Replace with the result of calling server
  return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
};

const loadMoreStoryItems = async (
  authToken: AuthToken,
  userAlias: string,
  pageSize: number,
  lastItem: Status | null
): Promise<[Status[], boolean]> => {
  // TODO: Replace with the result of calling server
  return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
};


const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
        <Route path="feed/:displayedUser" element={<StatusItemScroller featurePath="/feed" loadMoreFunction={loadMoreFeedItems} errorMessage="Failed to load feed items because of exception" />} />
        <Route path="story/:displayedUser" element={<StatusItemScroller featurePath="/story" loadMoreFunction={loadMoreStoryItems} errorMessage="Failed to load story items because of exception" />} />
        <Route path="followees/:displayedUser" element={<StatusItemScroller featurePath="/followees" loadMoreFunction={loadMoreFollowees} errorMessage="Failed to load followees because of exception" />} />
        <Route path="followers/:displayedUser" element={<StatusItemScroller featurePath="/followers" loadMoreFunction={loadMoreFollowers} errorMessage="Failed to load followers because of exception" />} />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;

import "./App.css";
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
import StatusItemScroller from "./components/mainLayout/StatusItemScroller";
import UserItemScroller from "./components/mainLayout/UserItemScroller";
import { UserItemView } from "./presenter/UserItemPresenter";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { StatusService } from "./model.service/StatusService";

const statusService = new StatusService();

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
        <Route path="feed/:displayedUser" element={<StatusItemScroller featurePath="/feed" loadMoreFunction={(authToken, userAlias, pageSize, lastStatus) => statusService.loadMoreFeedItems(authToken, userAlias, pageSize, lastStatus)} errorMessage="Failed to load feed items because of exception" />} />
        <Route path="story/:displayedUser" element={<StatusItemScroller featurePath="/story" loadMoreFunction={(authToken, userAlias, pageSize, lastStatus) => statusService.loadMoreStoryItems(authToken, userAlias, pageSize, lastStatus)} errorMessage="Failed to load story items because of exception" />} />
        <Route path="followees/:displayedUser" element={<UserItemScroller key={ 'followees=$(displayedUser!.alias)'} featurePath="/followees" presenterFactory={(view: UserItemView) => new FolloweePresenter(view)}/>} />
        <Route path="followers/:displayedUser" element={<UserItemScroller key={ 'followers=$(displayedUser!.alias)'} featurePath="/followers" presenterFactory={(view: UserItemView) => new FollowerPresenter(view)}/>} />
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

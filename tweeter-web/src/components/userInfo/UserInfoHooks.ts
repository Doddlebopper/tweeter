import { useContext, useRef } from "react"; 
import { UserInfoContext, UserInfoActionsContext } from "./UserInfoContexts";
import { UserInfo } from "./UserInfo";
import { useNavigate } from "react-router-dom";
import { AuthToken, User } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { UserService } from "../../model.service/UserService";

export const useUserInfo = (): UserInfo => {
  return useContext(UserInfoContext);
};

export const useUserInfoActions = () => {
  return useContext(UserInfoActionsContext);
};

export const useUserNavigation = () => {
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();
  const navigate = useNavigate();
  const userServiceRef = useRef<UserService>();

  if (!userServiceRef.current) {
    userServiceRef.current = new UserService();
  }

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    return userServiceRef.current!.getUser(authToken, alias);
  };

  const navigateToUser = async (
    event: React.MouseEvent,
    featurePath: string
  ): Promise<void> => {
    event.preventDefault();

    try {
      const alias = extractAlias(event.target.toString());

      const toUser = await getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          setDisplayedUser(toUser);
          navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    } catch (error) {
      displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };

  return {
    navigateToUser,
    extractAlias,
    getUser
  };
};
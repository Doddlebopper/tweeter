import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMessageActions } from "../toaster/MessageHooks";
import { useParams } from "react-router-dom";
import { AuthToken, User } from "tweeter-shared";
import { PagedItemView, PagedItemPresenter } from "../../presenter/PagedItemPresenter";
import { UserService } from "../../model.service/UserService";
import { Service } from "../../model.service/Service";

export const PAGE_SIZE = 10;

interface PagedItemScrollerProps<T, U extends Service> {
  featurePath: string;
  presenterFactory: (listener: PagedItemView<T>) => PagedItemPresenter<T, U>;
  itemRenderer: (item: T, index: number, featurePath: string) => React.ReactNode;
  getUserMethod?: (authToken: AuthToken, alias: string) => Promise<User | null>;
}

const PagedItemScroller = <T, U extends Service>({ 
  featurePath, 
  presenterFactory,
  itemRenderer,
  getUserMethod
}: PagedItemScrollerProps<T, U>) => {
  const { displayErrorMessage } = useMessageActions();
  const [items, setItems] = useState<T[]>([]);

  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  const listener: PagedItemView<T> = {
    addItems: (newItems: T[]) => setItems((previousItems) => [...previousItems, ...newItems]),
    displayErrorMessage: displayErrorMessage
  };

  const presenterRef = useRef<PagedItemPresenter<T, U> | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = presenterFactory(listener);
  }

  const userService = new UserService();

  // Update the displayed user context variable whenever the displayedUser url parameter changes. This allows browser forward and back buttons to work correctly.
  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam != displayedUser!.alias
    ) {
      const getUser = getUserMethod || ((authToken: AuthToken, alias: string) => 
        userService.getUser(authToken, alias)
      );
      
      getUser(authToken!, displayedUserAliasParam!).then((toUser) => {
        if (toUser) {
          setDisplayedUser(toUser);
        }
      });
    }
  }, [displayedUserAliasParam, getUserMethod]);

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
    loadMoreItems();
  }, [displayedUser]);

  const reset = async () => {
    setItems(() => []);
    presenterRef.current!.reset();
  };

  const loadMoreItems = async () => {
    presenterRef.current!.loadMoreItems(authToken!, displayedUser!.alias);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={() => loadMoreItems()}
        hasMore={presenterRef.current!.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => 
          itemRenderer(item, index, featurePath)
        )}
      </InfiniteScroll>
    </div>
  );
};

export default PagedItemScroller;

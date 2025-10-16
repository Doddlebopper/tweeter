import { Status } from "tweeter-shared";
import StatusItem from "../statusItem/StatusItem";
import { StatusItemPresenter } from "../../presenter/StatusItemPresenter";
import { PagedItemView } from "../../presenter/PagedItemPresenter";
import { StatusService } from "../../model.service/StatusService";
import PagedItemScroller from "./PagedItemScroller";

interface StatusItemScrollerProps {
  featurePath: string;
  presenterFactory: (listener: PagedItemView<Status>) => StatusItemPresenter;
}

const StatusItemScroller = ({ 
  featurePath, 
  presenterFactory
}: StatusItemScrollerProps) => {
  const statusItemRenderer = (status: Status, index: number, featurePath: string) => (
    <StatusItem key={index} status={status} featurePath={featurePath} />
  );

  return (
    <PagedItemScroller<Status, StatusService>
      featurePath={featurePath}
      presenterFactory={presenterFactory}
      itemRenderer={statusItemRenderer}
    />
  );
};

export default StatusItemScroller;

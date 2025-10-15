import { AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { Presenter, View } from "./Presenter";

export interface StatusItemView extends View {
    addItems: (items: Status[]) => void;
}

export abstract class StatusItemPresenter extends Presenter<StatusItemView> {
    private statusService: StatusService;
    private _hasMoreItems = true;
    private _lastItem: Status | null = null;

    protected constructor(view: StatusItemView) {
        super(view);
        this.statusService = new StatusService();
    }

    protected get service(): StatusService {
        return this.statusService;
    }

    protected get lastItem(): Status | null {
        return this._lastItem;
    }

    protected set lastItem(value: Status | null) {
        this._lastItem = value;
    }

    public get hasMoreItems(): boolean {
        return this._hasMoreItems;
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }

    public reset(): void {
        this._lastItem = null;
        this._hasMoreItems = true;
    }

    public abstract loadMoreItems(authToken: AuthToken, userAlias: string): any;
}


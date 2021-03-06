import { Component, IFloatingFilter, IFloatingFilterParams } from 'ag-grid-community';
import { SetFilterModel } from './setFilterModel';
export declare class SetFloatingFilterComp extends Component implements IFloatingFilter {
    private readonly eFloatingFilterText;
    private readonly valueFormatterService;
    private readonly columnModel;
    private params;
    private availableValuesListenerAdded;
    constructor();
    destroy(): void;
    init(params: IFloatingFilterParams): void;
    onParentModelChanged(parentModel: SetFilterModel): void;
    private addAvailableValuesListener;
    private updateFloatingFilterText;
}

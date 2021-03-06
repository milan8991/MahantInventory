import { ProvidedFilterModel } from 'ag-grid-community';
export declare type SetFilterModelValue = (string | null)[];
export interface SetFilterModel extends ProvidedFilterModel {
    filterType?: 'set';
    values: SetFilterModelValue;
}

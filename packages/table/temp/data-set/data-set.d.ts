import { Column, Filter, RowData, Sorter } from "../common/interface";
import type { Sheet } from "../sheet";
export declare abstract class DataSet {
    protected columns: Column[];
    protected originData: RowData[];
    protected sheet: Sheet;
    protected sorters: Sorter[];
    protected filters: Filter[];
    protected displayData: RowData[];
    constructor(sheet: Sheet);
}

export interface Node {
  id: string;

  width: number;
}

export interface LayoutInfo {
  colNodes: Node[];

  colLeafNodes: Node[];

  seriesNumberNodes?: Node[];
}

export type Indexes = [number, number, number, number];

export type PanelIndexes = {
  center: Indexes;

  frozenCol?: Indexes;

  frozenTrailingCol?: Indexes;
};

export type RowIndex = number;

export type DataIndex = string;

export interface Diff {
  add: [RowIndex, DataIndex][];
  remove: [RowIndex, DataIndex][];
}
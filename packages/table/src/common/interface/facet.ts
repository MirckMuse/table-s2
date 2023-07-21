export interface Node {
  id: string;

  width: number;
}

export interface LayoutInfo {
  colNodes: Node[];

  colLeafNodes: Node[];

  seriesNumberNodes?: Node[];
}
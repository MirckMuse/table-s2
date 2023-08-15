import { ColViewMeta, Column, LayoutInfo } from "../common/interface";
import { Sheet } from "../sheet";

// 数据层级
export class Hierarchy {
  width = 0;

  height = 0;

  maxDeep = -1;

  firstNodeInDeep: ColViewMeta[] = [];

  firstNodeInLastDeep: ColViewMeta | null = null;

  private allNodes: ColViewMeta[] = [];

  private nodeInLastDeep: ColViewMeta[] = [];

  getLeafs() {
    return this.allNodes.filter(node => node.isLeaf);
  }

  getNodesByDeep(deep?: number) {
    if (deep === undefined) return this.allNodes;

    return this.allNodes.filter(node => node.deep === deep);
  }

  insertNode(node: ColViewMeta, insertIndex = -1) {
    if (insertIndex === -1) {
      this.allNodes.push(node);
    } else {
      this.allNodes.splice(insertIndex, 0, node)
    }
  }

  pushNodeInLastDeep(node: ColViewMeta) {
    this.nodeInLastDeep.push(node);
  }

  getLastDeepNodes() {
    return this.nodeInLastDeep;
  }
}

// 计算表头的数据层级
export function calcuateHeaderHierarchy(sheet: Sheet): LayoutInfo & {
  hierarchy: Hierarchy
} {
  const { columns } = sheet.getDataConfig();
  const hierarchy = new Hierarchy();

  const colCellLeafNodes: ColViewMeta[] = [];

  function column2ColViewMeta(column: Column, parentMeta: ColViewMeta | null, deep = 0): ColViewMeta {
    const havaChildren = !!column.children?.length;

    const meta: ColViewMeta = {
      sheet,
      parent: parentMeta,
      isLeaf: !havaChildren,
      column,
      deep,
      // bbox 需要重置
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }

    if (havaChildren) {
      meta.children = column.children?.map(col => column2ColViewMeta(col, meta, deep + 1))
    } else {
      colCellLeafNodes.push(meta)
    }

    return meta
  }

  const colCellMetas = columns.map(column => column2ColViewMeta(column, null));

  return {
    colCellLeafNodes,
    colCellMetas,
    seriesNumberNodes: [],
    hierarchy
  }
}
import { DataCell } from "../cell";
import { Default_Col_Cell_Width } from "../common/constant";
import { ColViewMeta, LayoutType, ViewMeta } from "../common/interface";
import { LayoutInfo, ViewCellHeights } from "../common/interface/facet";
import { Hierarchy, calcuateHeaderHierarchy } from "../utils";
import { Facet } from "./facet";

export class TableFacet extends Facet {
  getDefaultCellHeight() {
    return this.getRowCellHeight()
  }

  getCellHeightByRowIndex(rowIndex: number) {
    // TODO: 后续根据 rowIndex 来获取单行实际高度。
    return this.getDefaultCellHeight();
  }

  protected calculateViewCellHeights(): ViewCellHeights {
    const defaultCellHeight = this.getDefaultCellHeight();

    return {
      getTotalHeight: () => {
        /**
         * 这里忽略了单元格换行的情况。
         */
        return defaultCellHeight * this.sheet.getDataSet().getDisplayDataSet()?.length
      },

      getTotalLength: () => {
        return this.sheet.getDataSet().getDisplayDataSet().length
      },

      getCellOffsetY: (offsetLength) => {
        if (offsetLength <= 0) return 0;

        /**
         * 这里忽略了单元格换行的情况。
         */
        return offsetLength * defaultCellHeight;
      },

      getIndexRange: (startY, endY) => {
        const startRowIndex = Math.max(0, Math.floor(startY / defaultCellHeight))

        // 防止数组index溢出导致报错
        const endRowIndex =
          endY % defaultCellHeight === 0
            ? endY / defaultCellHeight - 1
            : Math.floor(endY / defaultCellHeight);

        return {
          start: startRowIndex,
          end: endRowIndex
        }
      }
    }
  }

  getViewCellHeights() {
    return this.viewCellHeights
  }

  protected getCellMeta(rowIndex: number, lastDataIndex: string) {
    const dataSet = this.sheet.getDataSet();

    const matchedColumn = dataSet.getLastColumns().find(column => column.dataIndex === lastDataIndex);
    if (!matchedColumn) return null;

    const { colCellLeafNodes } = this.layoutInfo;
    const matchedColCell = colCellLeafNodes.find(cell => cell.column.dataIndex === lastDataIndex);
    if (!matchedColCell) return null;

    const cellY = this.viewCellHeights.getCellOffsetY(rowIndex);
    const cellHeight = this.getCellHeightByRowIndex(rowIndex);

    const viewMeta: ViewMeta = {
      sheet: this.sheet,
      record: null,
      rowIndex,
      column: matchedColumn,
      x: matchedColCell?.x ?? 0,
      y: cellY,
      width: matchedColCell?.width ?? 0,
      height: cellHeight
    };
    viewMeta.record = dataSet.getRowData(viewMeta);

    return viewMeta;
  }

  // 创建一个数据单元格
  protected createCell(viewMeta: ViewMeta): DataCell {
    const { dataCell } = this.sheet.getConfig()

    return dataCell?.override?.(this.sheet, viewMeta) ?? new DataCell(this.sheet, viewMeta);
  }

  hierarchy: Hierarchy;

  protected calcLayoutInfo(): LayoutInfo {
    const { colCellLeafNodes, colCellMetas, hierarchy } = calcuateHeaderHierarchy(this.sheet);

    this.hierarchy = hierarchy;

    this.calcuateHeaderNodesCoordinate({ colCellLeafNodes, colCellMetas });

    return {
      colCellLeafNodes,
      colCellMetas,
      seriesNumberNodes: []
    }
  }

  // 计算表头单元格坐标
  protected calcuateHeaderNodesCoordinate(layoutInfo: LayoutInfo) {
    const sheetWidth = this.sheet.width ?? 0;
    const { colCellLeafNodes, colCellMetas } = layoutInfo;

    // TODO: 重置节点的宽度 这里的计算逻辑需要再考虑下,比如设置的列宽度和小于总宽度
    const nodeLengthWithoutWidth = colCellLeafNodes.filter(node => !node.width).length || 1;
    const nodeWidthHaveWidth = colCellLeafNodes.reduce((total, node) => total + (node.width ?? 0), 0);
    const nodeWidth = Math.floor(Math.max((sheetWidth - nodeWidthHaveWidth) / nodeLengthWithoutWidth, Default_Col_Cell_Width));

    for (const node of colCellLeafNodes) {
      node.width = node.width || nodeWidth
    }

    function calcuateColCellWidthAndX(nodes: ColViewMeta[], startX = 0) {
      let reduceX = startX;

      nodes.forEach(node => {
        if (node.children) {
          calcuateColCellWidthAndX(node.children, reduceX);
          node.width = node.children.reduce((total, n) => total + n.width, 0)
        }
        node.x = reduceX;
        reduceX += node.width;
      });
    }
    calcuateColCellWidthAndX(colCellMetas);

    // TODO: 计算高度

    colCellMetas.forEach(col => {
      col.height = 32
    })
  }

  protected calcuateColCellHeight(meta: ColViewMeta): number {
    // TODO: getColNodeHeight
    return 0;
  }

  protected calcuateLeafColCellWidth(meta: ColViewMeta, adaptiveColWidth: number): number {
    // TODO: calculateColLeafNodesWidth
    return 0;
  }

  // 计算自适应的列宽
  protected calcuateAdaptiveColWidth(metas: ColViewMeta[]): number {
    const { layout = LayoutType.Adaptive, dataCell } = this.sheet.getConfig();
    const configDefaultDataCell = dataCell?.width ?? 0;

    // 紧凑布局下直接使用配置的宽度。
    if (layout === LayoutType.Compact) {
      return configDefaultDataCell;
    }

    const lastcolumns = metas.map(meta => meta.column);
    const configReduceColumnWidth = lastcolumns.reduce((width, column) => width + (column.width ?? 0), 0);
    const { width = 0 } = this.sheet;
    if (configReduceColumnWidth > width) {
      return configDefaultDataCell;
    }
    const noWidthColumnLength = lastcolumns.filter(column => Math.max(Number(column) || 0, 0) === 0).length

    // TODO: 自适应宽度向下取整，偏差部分的宽度可以考虑放到最后一个非固定列上。
    return Math.max(
      configDefaultDataCell,
      Math.floor(width / Math.max(1, noWidthColumnLength))
    );
  }
}
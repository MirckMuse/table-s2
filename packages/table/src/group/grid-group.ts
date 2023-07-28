import { Group, DisplayObjectConfig, GroupStyleProps, Line } from '@antv/g'
import type { Sheet } from '../sheet'
import { Grid_Group_Id } from '../common/constant';

export type GridGroupConfig = DisplayObjectConfig<GroupStyleProps> & {
  sheet: Sheet
}

export interface GridInfo {
  cols: number[];

  rows: number[];
}

export class GridGroup extends Group {
  protected sheet: Sheet;

  constructor(config: GridGroupConfig) {
    const { sheet, ...rest } = config
    super(rest)
    this.sheet = sheet
  }

  gridGroup: Group;

  gridInfo: GridInfo = {
    cols: [],
    rows: []
  };

  updateGrid(gridInfo: GridInfo, id = Grid_Group_Id) {
    const bbox = this.getBBox();
    const { dataCell } = this.sheet.theme

    const style = dataCell.cell

    if (!this.gridGroup || !this.getElementById(id)) {
      this.gridGroup = this.appendChild(new Group({ id }))
    }
    this.gridGroup.removeChildren();

    this.gridInfo = gridInfo;

    const { cols, rows } = this.gridInfo

    // 绘制垂直的边框
    const { verticalBorderWidth, verticalBorderColorOpacity, verticalBorderColor } = style;
    const halfVerticalBorderWidth = verticalBorderWidth / 2;
    const renderColLine = (colX: number) => {
      this.gridGroup.appendChild(new Line({
        style: {
          x1: colX - halfVerticalBorderWidth,
          x2: colX - halfVerticalBorderWidth,
          y1: halfVerticalBorderWidth,
          y2: Math.floor(bbox.height - halfVerticalBorderWidth),
          stroke: verticalBorderColor,
          strokeOpacity: verticalBorderColorOpacity,
          lineWidth: verticalBorderWidth,
          lineCap: 'square'
        }
      }));
    }
    cols.forEach(renderColLine)

    // 绘制水平的直线
    const { horizontalBorderColor, horizontalBorderWidth, horizontalBorderColorOpacity } = style;
    const halfHorizontalBorderWidth = horizontalBorderWidth / 2;

    const renderRowLine = (colY: number) => {
      this.gridGroup.appendChild(new Line({
        style: {
          x1: halfHorizontalBorderWidth,
          x2: Math.floor(bbox.width - halfHorizontalBorderWidth),
          y1: colY - halfHorizontalBorderWidth,
          y2: colY - halfHorizontalBorderWidth,
          stroke: horizontalBorderColor,
          strokeOpacity: horizontalBorderColorOpacity,
          lineWidth: horizontalBorderWidth,
          lineCap: 'square'
        }
      }));
    }
    rows.forEach(renderRowLine);

    // 置顶分割线
    this.gridGroup.toFront();
  }
}
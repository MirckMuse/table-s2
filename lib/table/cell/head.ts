import { S2Table } from "../table";
import { DefaultTheme } from "../theme";
import { ICellMeta, IPosition, ITableColumn } from '../typing';
import BaseCell from "./base";
import { Rect, Group, Text } from '@antv/g'

/**
 * 表头单元格
 */
export default class HeadCell extends BaseCell {
  _column: ITableColumn | null = null;

  _cell: Group | null = null;

  _text: Text | null = null;

  _background: Rect | null = null;

  constructor(table: S2Table, meta: ICellMeta, column: ITableColumn) {
    super(table, meta);
    this._column = column
    this.calcCellPosition()
    this.initText();
    this.initBackground()
    this.initCell();
    this.render();
  }

  // 计算单元格的位置信息
  calcCellPosition() {
  }

  getTextPostion(): IPosition {
    const position = this.meta?.position
    const { theme } = this.table;
    const { headCell = DefaultTheme.headCell } = theme

    return {
      x: position?.x ?? 0,
      y: (position?.y ?? 0) + (headCell?.fontSize ?? 0),
    }

  }

  initText() {
    if (!this.table) return
    const { theme } = this.table
    const { headCell = DefaultTheme.headCell } = theme
    this._text = this._text || new Text({
      style: {
        ...this.getTextPostion(),
        text: this._column?.title ?? '',
        fontSize: headCell?.fontSize,
        fill: headCell?.color,
      },
    })
  }

  initBackground() {
    if (!this.table) return
    const { theme } = this.table
    const { headCell = DefaultTheme.headCell } = theme
    const position = this.meta?.position

    this._background = this._background || new Rect({
      style: {
        x: position?.x,
        y: position?.y,
        width: 200, // 需要计算,
        height: headCell?.height ?? 32,
        fill: headCell?.background,
        stroke: headCell?.borderColor,
        lineWidth: 1
      }
    })
  }

  initCell() {
    this._cell = new Group()
    this._background && this._cell.appendChild(this._background)
    this._text && this._cell.appendChild(this._text)
  }

  // 渲染
  render() {
    if (!this.table || !this._cell) return

    this.table.tableContainer?.appendChild(this._cell)
  }
}
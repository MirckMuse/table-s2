import { FederatedPointerEvent, Group, Rect } from "@antv/g";
import { InteractionType, TableEvent } from "../../common/constant";
import { BaseEvent } from "../../event/base";
import { DataCell, Cell } from "table/src/cell";

export class HoverInteraction extends BaseEvent {

  static HoverGroupName = 'hover_interaction_name';
  static HoverGroupZIndex = 5;

  public bindEvents(): void {
    this.bindDataCellHover();
  }

  hoverCell: Cell | null;

  protected bindDataCellHover() {
    this.sheet.on(TableEvent.DATA_PANEL_LEAVE, () => {
      const rowIndex = this.hoverCell?.getMeta().rowIndex ?? -1;
      this.hoverCell = null;
      if (rowIndex === -1) return;

      const allDataCell = this.sheet.facet.getDataCells();
      allDataCell
        .filter((cell: DataCell) => cell.getMeta().rowIndex === rowIndex)
        .forEach(cell => cell.clearInteractiveState())
    })
    // FIXME: 当鼠标离开单元格的时候，在这里没法清理行悬浮效果
    this.sheet.on(TableEvent.DATA_CELL_HOVER, (event: FederatedPointerEvent) => {
      const cell = this.sheet.getCell(event.target);
      if (!cell) return;

      // 防止同一单元格反复计算。
      if (this.hoverCell === cell) return;

      const allDataCell = this.sheet.facet.getDataCells();
      const preRowIndex = this.hoverCell?.getMeta()?.rowIndex ?? -1;

      // 设置单元格的 hover 状态
      this.hoverCell = cell;
      const rowIndex = cell.getMeta().rowIndex;

      allDataCell
        .filter((cell: DataCell) => {
          const cellRowIndex = cell.getMeta().rowIndex
          return cellRowIndex === rowIndex || cellRowIndex === preRowIndex;
        })
        .forEach(dataCell => {
          const cellRowIndex = dataCell.getMeta().rowIndex
          if (cellRowIndex === rowIndex) {
            dataCell.updateState(InteractionType.Hover);
            return
          }

          if (cellRowIndex === preRowIndex) {
            dataCell.clearInteractiveState();
          }
        })
    })
  }

  public unbindEvents(): void {
    // throw new Error("Method not implemented.");
  }
}

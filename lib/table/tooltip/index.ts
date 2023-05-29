import { CellTypes, S2CellType, ViewMeta } from "@antv/s2"

// 获取单元格需要展示tooltip的策略
export const Tooltip_Strategy: Record<string, Function> = {
  // 行头单元格的tooltip策略
  [CellTypes.COL_CELL](cell: S2CellType<ViewMeta>) {
    const meta = cell.getMeta()
    if (cell.getActualText() === meta.label) return ''

    return meta.label
  },
  // 数值单元格的tooltip策略
  [CellTypes.DATA_CELL](cell: S2CellType<ViewMeta>) {
    const meta = cell.getMeta()
    if (cell.getActualText() === meta.fieldValue) return ''

    return meta.fieldValue
  }
}
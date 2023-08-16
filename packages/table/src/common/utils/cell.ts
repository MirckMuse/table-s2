import { LineStyleProps } from "@antv/g";
import { CellBorderPosition, CellTheme, SimpleBBox } from "../interface";

export function calcuateCellBorderStyle(
  borderPosition: CellBorderPosition,
  bbox: SimpleBBox,
  cellStyle: CellTheme
): LineStyleProps {
  // 新的策略方法
  const strategy: Record<CellBorderPosition, (bbox: SimpleBBox, cellStyle: CellTheme) => LineStyleProps> = {
    [CellBorderPosition.TOP](bbox, cellStyle) {
      const { horizontalBorderWidth = 0 } = cellStyle
      return {
        x1: bbox.x,
        x2: bbox.x + bbox.width,
        y1: bbox.y + horizontalBorderWidth / 2,
        y2: bbox.y + horizontalBorderWidth / 2,
        lineWidth: horizontalBorderWidth,
        stroke: cellStyle.horizontalBorderColor,
        strokeOpacity: cellStyle.horizontalBorderColorOpacity
      }
    },
    [CellBorderPosition.BOTTOM](bbox, cellStyle) {
      const { horizontalBorderWidth = 0 } = cellStyle
      return {
        x1: bbox.x,
        x2: bbox.x + bbox.width,
        y1: bbox.y + bbox.height - horizontalBorderWidth / 2,
        y2: bbox.y + bbox.height - horizontalBorderWidth / 2,
        lineWidth: horizontalBorderWidth,
        stroke: cellStyle.horizontalBorderColor,
        strokeOpacity: cellStyle.horizontalBorderColorOpacity
      }
    },
    [CellBorderPosition.LEFT](bbox, cellStyle) {
      const { verticalBorderWidth = 0 } = cellStyle
      return {
        x1: bbox.x + verticalBorderWidth / 2,
        x2: bbox.x + verticalBorderWidth / 2,
        y1: bbox.y,
        y2: bbox.y + bbox.height,
        lineWidth: verticalBorderWidth,
        stroke: cellStyle.verticalBorderColor,
        strokeOpacity: cellStyle.verticalBorderColorOpacity
      }
    },
    [CellBorderPosition.RIGHT](bbox, cellStyle) {
      const { verticalBorderWidth = 0 } = cellStyle
      return {
        x1: bbox.x + bbox.width - verticalBorderWidth / 2,
        x2: bbox.x + bbox.width - verticalBorderWidth / 2,
        y1: bbox.y,
        y2: bbox.y + bbox.height,
        lineWidth: cellStyle.verticalBorderWidth,
        stroke: cellStyle.verticalBorderColor,
        strokeOpacity: cellStyle.verticalBorderColorOpacity
      }
    }
  }

  return strategy[borderPosition](bbox, cellStyle);
}
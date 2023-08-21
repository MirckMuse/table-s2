import { BaseBBox } from "./bbox";

export class PanelBBox extends BaseBBox {
  protected calcuateBBox(): void {
    // 获取 panel 的真实尺寸
    this.originWidth = this.facet.getRealWidth()
    this.originHeight = this.facet.getRealHeight() ?? 100

    const {
      width: sheetWidth = 0,
      height: sheetHeight = 0
    } = this.sheet;


    const scrollbarSize = this.sheet.theme.scrollbar.size ?? 0;

    this.width = Math.max(0, sheetWidth - this.x);
    this.height = Math.max(0, sheetHeight - this.y - scrollbarSize)


    this.viewportWidth = Math.abs(
      Math.floor(Math.min(this.width, this.originWidth))
    )
    this.viewportHeight = Math.abs(
      Math.floor(Math.min(this.height, this.originHeight))
    )

    this.minY = this.y = this.facet.columnHeader?.style.height ?? 0;
    // TODO:
  }
}
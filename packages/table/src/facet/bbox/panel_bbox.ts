import { BaseBBox } from "./bbox";

export class PanelBBox extends BaseBBox {
  protected calcuateBBox(): void {
    // 获取 panel 的真实尺寸
    this.originWidth = this.facet.getRealWidth()
    this.originHeight = this.facet.getRealHeight()

    // TODO:
  }
}
import { Group, Rect } from "@antv/g";
import { ColCell } from "../cell";
import { Col_Scroll_Group_Key, Col_Scroll_Group_Z_Index } from "../common/constant";
import { ColCellConfig, ColViewMeta, ColumnHeaderMeta, ScrollOffset } from "../common/interface";
import { translateX } from "../utils";
import { BaseHeader } from "./base";

export class ColumnHeader extends BaseHeader<ColumnHeaderMeta> {
  protected type = 'ColumnHeader';

  init() {
    this.initScrollGroup();
  }

  protected layout(): void {
    const { colCellMetas } = this.meta;

    const { colCell } = this.sheet.getConfig();

    colCellMetas.forEach(meta => this.recursionLayoutCell(meta, colCell?.override))
  }

  protected recursionLayoutCell(meta: ColViewMeta, colCellOverride: ColCellConfig['override']) {
    if (!this.isCellInHeader(meta)) return;

    const cell = colCellOverride
      ? colCellOverride(this.sheet, meta, this.meta)
      : new ColCell(this.sheet, meta, this.meta);

    meta.belongsCell = cell;
    this.scrollGroup.appendChild(cell);

    if (meta.children) {
      meta.children.forEach(item => this.recursionLayoutCell(item, colCellOverride))
    }
  }

  protected offset(): void {
    const { scrollX = 0 } = this.meta;

    translateX(this.scrollGroup, scrollX)
  }

  protected clip(): void {
    const { height, width } = this.meta

    this.scrollGroup.style.clipPath = new Rect({
      style: {
        x: 0,
        y: 0,
        width,
        height,
      }
    })
  }

  scrollGroup: Group;
  protected initScrollGroup() {
    this.scrollGroup = this.appendChild(new Group({
      name: Col_Scroll_Group_Key,
      style: {
        zIndex: Col_Scroll_Group_Z_Index
      }
    }));
  }

  clear() {
    this.scrollGroup?.removeChildren();
  }

  isCellInHeader(colViewMeta: ColViewMeta) {
    const { width, scrollX = 0 } = this.meta;
    const { x: cellX, width: cellWidth } = colViewMeta;

    return (
      width + scrollX > cellX &&
      scrollX < cellX + cellWidth
    )

  }

  renderByScrollOffset(scrollOffset: ScrollOffset) {
    if (
      this.meta.scrollX === scrollOffset.scrollX &&
      this.meta.scrollY === scrollOffset.scrollY
    ) return;

    this.meta.scrollX = scrollOffset.scrollX;
    this.meta.scrollY = scrollOffset.scrollY;
    this.render();
  }
}
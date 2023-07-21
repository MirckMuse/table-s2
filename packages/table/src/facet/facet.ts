import type { LayoutInfo } from "../common/interface/facet";
import type { Sheet } from "../sheet";

import { Group } from "@antv/g";
import { Background_Group_Key, Background_Group_ZIndex, Foreground_Group_Key, Foreground_Group_ZIndex, Panel_Group_Key, Panel_Group_ZIndex, TableEvent } from "../common/constant";
import { last } from 'lodash-es'
import { PanelBBox } from "./bbox/panel_bbox";
import { ScrollEvent } from "./scroll";
import { ColumnHeader } from "../header";

export abstract class Facet {
  sheet: Sheet;

  scrollEvent: ScrollEvent;

  constructor(sheet: Sheet) {
    this.sheet = sheet
    this.init()
  }

  protected init() {
    this.initGroups();

    // TODO: s2 debug 的地方还有其他信息的初始化
    this.layoutInfo = this.calcLayoutInfo();

    this.calculateViewCellsSize();
    this.calculatePanelBBox();
    this.bindEvents()
  }

  backgroundGroup: Group;
  foregroundGroup: Group;

  protected initGroups() {
    const sheetCanvas = this.sheet.getCanvas()

    this.backgroundGroup = sheetCanvas.appendChild(new Group({
      name: Background_Group_Key,
      style: { zIndex: Background_Group_ZIndex }
    }))

    this.panelGroup = sheetCanvas.appendChild(new Group({
      name: Panel_Group_Key,
      style: { zIndex: Panel_Group_ZIndex }
    }))

    this.foregroundGroup = sheetCanvas.appendChild(new Group({
      name: Foreground_Group_Key,
      style: { zIndex: Foreground_Group_ZIndex }
    }))
  }

  bindEvents() {
    this.emitPaginationEvent();
  }

  emitPaginationEvent() {
    const { pagination } = this.sheet.getConfig()

    if (!pagination) return

    // TODO: s2 的 total 使用的是可视单元格的数量
    const { current = 1, pageSize = 10, total = 0 } = pagination

    const pageCount = Math.floor((total - 1) / pageSize) + 1

    this.sheet.emit(TableEvent.LAYOUT_PAGINATION, { pageSize, pageCount, total, current })
  }

  unbindEvents() {
    // TODO:
  }

  render() {
    this.initScrollEvent();
    this.scrollEvent.adjustScrollOffset();
    this.renderSheetHeader();
    this.renderBackground();
    this.dynamicRenderCell();
  }

  columnHeader: ColumnHeader;

  renderSheetHeader() {
    this.renderColumnHeader();
    // TODO:

    this.foregroundGroup.appendChild(this.columnHeader);
  }

  getColumnHeader() {
    return this.columnHeader;
  }

  protected renderColumnHeader() {
    if (this.columnHeader) return;
    // TODO:

    this.columnHeader = new ColumnHeader();
  }

  adjustScrollOffset() {
    // TODO:
  }

  renderBackground() {
    // TODO:
  }

  initScrollEvent() {
    this.scrollEvent = new ScrollEvent(this.sheet);
  }

  destroy() {
    this.unbindEvents()
  }

  // 可视单元格的宽度
  viewCellWidths: number[];

  // 可视单元格的高度
  viewCellHeights: number[];

  getRealWidth() {
    return last(this.viewCellWidths) ?? 0
  }

  getRealHeight() {
    // TODO:
    return 0
  }

  // 计算可视单元格的尺寸
  protected calculateViewCellsSize() {
    let reduceWidth = 0;

    this.viewCellWidths = (this.layoutInfo?.colLeafNodes ?? []).reduce<number[]>((widths, node) => {
      reduceWidth += node.width;
      return widths.concat(reduceWidth)
    }, []);

    // TODO:
    this.viewCellHeights = []
  }

  layoutInfo: LayoutInfo;

  protected abstract calcLayoutInfo(): LayoutInfo;

  panelGroup: Group;
  public panelBBox: PanelBBox;
  protected calculatePanelBBox() {
    this.panelBBox = new PanelBBox(this, true)
  }

  dynamicRenderCell() {
  }
}

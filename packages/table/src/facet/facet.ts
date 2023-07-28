import type { Diff, LayoutInfo, PanelIndexes } from "../common/interface/facet";
import type { Sheet } from "../sheet";

import { Group, Rect } from "@antv/g";
import { last } from 'lodash-es';
import { Cell } from "../cell";
import { Background_Group_Key, Background_Group_ZIndex, Foreground_Group_Key, Foreground_Group_ZIndex, Panel_Group_Key, Panel_Group_ZIndex, Panel_Scroll_Group_Id, Panel_Scroll_Group_Key, Panel_Scroll_Group_ZIndex, TableEvent } from "../common/constant";
import { BaseViewMeta, ViewMeta } from "../common/interface";
import { ColumnHeader } from "../header";
import { PanelBBox } from "./bbox/panel_bbox";
import { ScrollEvent, getAdjustedScrollOffset } from "./scroll";
import { PanelScrollGroup } from "../group/panel-scroll-group";
import { GridInfo } from "../group";

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
    this.initBackgroundGroup();
    this.initPanelGroup();
    this.initPanelScrollGroup();
    this.initForegroundGroup();
  }

  translateRelatedGroups() {
    // TODO:
  }

  protected initBackgroundGroup() {
    const sheetCanvas = this.sheet.getCanvas()

    this.backgroundGroup = sheetCanvas.appendChild(new Group({
      name: Background_Group_Key,
      style: { zIndex: Background_Group_ZIndex }
    }));
  }

  panelScrollGroup: PanelScrollGroup;

  protected initPanelScrollGroup() {
    this.panelScrollGroup = new PanelScrollGroup({
      sheet: this.sheet,
      name: Panel_Scroll_Group_Key,
      style: {
        zIndex: Panel_Scroll_Group_ZIndex
      }
    });
    this.panelGroup.appendChild(this.panelScrollGroup);
  }

  updatePanelScrollGroup() {
    this.panelScrollGroup.updateGrid(this.getGridInfo());
  }

  initPanelGroup() {
    const sheetCanvas = this.sheet.getCanvas()

    this.panelGroup = sheetCanvas.appendChild(new Group({
      name: Panel_Group_Key,
      style: { zIndex: Panel_Group_ZIndex }
    }));
  }

  initForegroundGroup() {
    const sheetCanvas = this.sheet.getCanvas();

    this.foregroundGroup = sheetCanvas.appendChild(new Group({
      name: Foreground_Group_Key,
      style: { zIndex: Foreground_Group_ZIndex }
    }));
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
    this.scrollEvent.unbindEvents();
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

  getGridInfo(): GridInfo {
    // TODO:
    return {
      cols: [],
      rows: []
    }
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
    const { width = 0, height = 0 } = this.sheet;
    const { color: fill, opacity } = this.sheet.theme.background;

    this.backgroundGroup.appendChild(new Rect({
      style: { fill, opacity, x: 0, y: 0, width, height }
    }))
  }

  initScrollEvent() {
    this.scrollEvent = new ScrollEvent(this.sheet);
  }

  clearGroup() {
    const { children = [] } = this.panelGroup
    children.forEach(childGroup => {
      if (childGroup instanceof Group) {
        childGroup.removeChildren()
      } else {
        childGroup.remove()
      }
    })
    this.foregroundGroup?.removeChildren?.()
    this.backgroundGroup?.removeChildren?.()
  }

  destroy() {
    this.unbindEvents();
    this.clearGroup();
    this.preCellIndexes = null;
    this.scrollEvent.unbindEvents();
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

  getPaginationScrollY(): number {
    const { pagination } = this.sheet.getConfig()

    if (!pagination) return 0

    const { current, pageSize } = pagination
    const offset = Math.max((current - 1) * pageSize, 0)

    // FIXME: 可见高度的样式的偏差
    return offset
  }

  dynamicRenderCell() {
    const { scrollX, scrollY: originalScrollY } = this.scrollEvent.getScrollOffset()

    const scrollY = originalScrollY + this.getPaginationScrollY();

    // FIXME:
    const totalHeight = 0

    const adjustedScrollY = getAdjustedScrollOffset(scrollY, totalHeight, this.panelBBox.viewportHeight)

    // TODO: S2 会隐藏 tooltip 和清除悬浮时间

    this.renderCell(scrollX, adjustedScrollY);
    this.updatePanelScrollGroup();
    this.translateRelatedGroups();
    // TODO:
    this.afterRender()
  }

  protected preCellIndexes: PanelIndexes | null;

  diffPanelIndexes(preIndexes: PanelIndexes, indexes: PanelIndexes): Diff {
    // TODO:
    return {
      add: [], remove: []
    }
  }

  protected abstract getCellMeta(rowIndex: number, dataIndex: string): BaseViewMeta;

  protected abstract createCell(viewMeta: BaseViewMeta): Cell<BaseViewMeta>;

  protected renderCell(scrollX: number, scrollY: number) {
    const indexes = this.calculateXYIndexes(scrollX, scrollY);

    const { add, remove } = this.diffPanelIndexes(this.preCellIndexes!, indexes);

    add.forEach(([rowIndex, dataIndex]) => {
      const meta = this.getCellMeta(rowIndex, dataIndex);

      const cell = this.createCell(meta);
      cell.name = `${rowIndex}-${dataIndex}`;
      this.addCell(cell);
    })

    const cells = this.getAllCellsByType();
    remove.forEach(([rowIndex, dataIndex]) => {
      const matchedCell = cells.find(cell => cell.name === `${rowIndex}-${dataIndex}`)

      matchedCell?.remove();
    });

    this.preCellIndexes = indexes;
    this.sheet.emit(TableEvent.LAYOUT_AFTER_REAL_DATA_CELL_RENDER, {
      add,
      remove,
      sheet: this.sheet
    })
  }

  calculateXYIndexes(scrollX: number, scrollY: number): PanelIndexes {
    return {
      center: [0, 0, 0, 0]
    }
    // TODO:
  }

  afterRender() {
    // TODO: S2 onAfterScroll;
  }

  getAllCells() {
    const children = this.panelGroup.children

    if (children.length) return [];

    return children;
  }

  getAllCellsByType(cellType = Cell) {
    const allCells = this.getAllCells();

    return allCells.reduce<Cell<BaseViewMeta>[]>((result, cell) => {
      if (cell instanceof Cell) {
        result.push(cell)
      }

      if (cell instanceof Group) {
        result = result.concat(cell.children.filter(item => item instanceof cellType) as Cell<BaseViewMeta>[]);
      }

      return result;
    }, []);
  }

  addCell = (cell: Cell<BaseViewMeta>) => {
    this.initPanelScrollGroup
  }
}

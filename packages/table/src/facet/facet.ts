import type { Diff, Indexes, LayoutInfo, PanelIndexes, ViewCellHeights, ViewCellWidths } from "../common/interface/facet";
import type { Sheet } from "../sheet";

import { Group, Rect } from "@antv/g";
import { last } from 'lodash-es';
import { Cell, DataCell } from "../cell";
import { Background_Group_Key, Background_Group_ZIndex, Default_Col_Cell_Height, Default_Data_Cell_Height, Foreground_Group_Key, Foreground_Group_ZIndex, Panel_Group_Key, Panel_Group_ZIndex, Panel_Scroll_Group_Key, Panel_Scroll_Group_ZIndex, TableEvent } from "../common/constant";
import { BaseViewMeta, ColViewMeta, Column, SimpleBBox, WheelOffset } from "../common/interface";
import { GridInfo } from "../group";
import { PanelScrollGroup } from "../group/panel-scroll-group";
import { ColumnHeader } from "../header";
import { calcuateViewportIndexes, diffIndexes, translateGroup } from "../utils";
import { PanelBBox } from "./bbox/panel_bbox";
import { ScrollEvent, getAdjustedScrollOffset } from "./scroll";

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

  translateRelatedGroups(scrollX: number, scrollY: number) {
    translateGroup(this.panelScrollGroup, scrollX, scrollY);
    // TODO:

    this.columnHeader?.renderByScrollOffset({ scrollX, scrollY });
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

    const { x, width } = this.panelBBox;

    this.columnHeader = new ColumnHeader(this.sheet, {
      width,
      height: 100, // TODO: 这里的高度需要遍历 col 后才能得知
      position: { x, y: 0 },
      colCellMetas: this.layoutInfo.colCellMetas || []
    });

    this.foregroundGroup.appendChild(this.columnHeader);
  }

  getColumnHeader(): ColumnHeader | null {
    return this.columnHeader ?? null;
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
  viewCellWidths: ViewCellWidths;

  // 可视单元格的高度
  viewCellHeights: ViewCellHeights;

  getRealWidth() {
    return last(Object.values(this.viewCellWidths).sort((a, b) => a - b)) ?? 0
  }

  getRowCellHeight() {
    return this.sheet.getConfig().dataCell?.height ?? Default_Data_Cell_Height;
  }

  getRealHeight() {
    const pagination = this.sheet.getConfig().pagination

    if (pagination) {
      // TODO:
      return 0
    }

    return this.viewCellHeights.getTotalHeight();
  }

  // 计算可视单元格的尺寸
  protected calculateViewCellsSize() {
    this.viewCellWidths = this.calculateViewCellWidths();

    this.viewCellHeights = this.calculateViewCellHeights();
  }

  protected calculateViewCellWidths() {
    let reduceWidth = 0;
    return (this.layoutInfo.colCellLeafNodes ?? []).reduce<ViewCellWidths>((widths, node) => {
      reduceWidth += node.width;
      widths[node.column.dataIndex] = reduceWidth;
      return widths
    }, {});
  }

  protected abstract calculateViewCellHeights(): ViewCellHeights;

  layoutInfo: LayoutInfo;
  protected abstract calcLayoutInfo(): LayoutInfo;

  panelGroup: Group;
  public panelBBox: PanelBBox;
  protected calculatePanelBBox() {
    this.panelBBox = new PanelBBox(this, true)
  }

  // 滚动的范围是否在 panel 中。
  isScrollOverPanel({ offsetX, offsetY }: WheelOffset) {
    const { minX, minY, maxX, maxY } = this.panelBBox;

    return minX < offsetX && offsetX < maxX && minY < offsetY && offsetY < maxY;
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
    const totalHeight = 0;

    const adjustedScrollY = getAdjustedScrollOffset(scrollY, totalHeight, this.panelBBox.viewportHeight)

    // TODO: S2 会隐藏 tooltip 和清除悬浮时间
    this.renderCell(scrollX, adjustedScrollY);
    this.updatePanelScrollGroup();
    this.translateRelatedGroups(scrollX, scrollY);
    // TODO:
    this.afterRender()
  }

  protected preCellIndexes: PanelIndexes | null;

  get lastViewColumns(): Column[] {
    // TODO: 获取最后一列可见的列配置
    return []
  }

  diffPanelIndexes(preIndexes: PanelIndexes | null, indexes: PanelIndexes): Diff {
    return Object.keys(indexes).reduce<Diff>(
      (result, key) => {
        const { add, remove } = diffIndexes(
          (preIndexes?.[key as keyof PanelIndexes] ?? []) as Indexes,
          indexes[key as keyof PanelIndexes] as Indexes
        )

        result.add = result.add.concat(add);
        result.remove = result.remove.concat(remove);
        return result
      },
      { add: [], remove: [] }
    );
  }

  // 渲染单元格
  protected renderCell(scrollX: number, scrollY: number) {
    const indexes = this.calculateXYIndexes(scrollX, scrollY);

    const { add, remove } = this.diffPanelIndexes(this.preCellIndexes, indexes);

    add.forEach(([rowIndex, dataIndex]) => {
      const meta = this.getCellMeta(rowIndex, dataIndex);
      if (!meta) return

      const cell = this.createCell(meta);
      cell.name = `${rowIndex}-${dataIndex}`;
      this.addCell(cell);
    })

    const cells = this.getDataCells();
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
    const { viewportHeight, viewportWidth } = this.panelBBox;

    const viewport: SimpleBBox = { x: 0, y: 0, height: viewportHeight, width: viewportWidth };

    return {
      center: calcuateViewportIndexes({
        scrollX,
        scrollY,
        viewCellHeights: this.viewCellHeights,
        viewCellWidths: this.viewCellWidths,
        viewport
      })
    }
  }

  afterRender() {
    // TODO: S2 onAfterScroll;
  }

  getAllCells() {
    const children = this.panelGroup.children

    if (children.length) return [];

    return children;
  }

  getDataCells() {
    const allCells = this.getAllCells();

    return allCells.reduce<Cell<BaseViewMeta>[]>((result, cell) => {
      if (cell instanceof DataCell) {
        result.push(cell)
      }

      if (cell instanceof Group) {
        return result.concat(cell.children.filter(item => item instanceof DataCell) as DataCell[]);
      }

      return result;
    }, []);
  }

  protected getColCellHeight(meta: ColViewMeta): number {
    // TODO: S2 getDefaultColNodeHeight
    return Default_Col_Cell_Height;
  }

  // 新增一个 cell。
  addCell = (cell: Cell<BaseViewMeta>) => {
    this.panelScrollGroup?.appendChild(cell);
    this.sheet.emit(TableEvent.LAYOUT_CELL_MOUNTED, cell)
  }

  protected abstract getCellMeta(rowIndex: number, dataIndex: string): BaseViewMeta | null;

  protected abstract createCell(viewMeta: BaseViewMeta): Cell;
}

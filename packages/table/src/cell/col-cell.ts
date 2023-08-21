import { InteractionType } from "../common/constant";
import { BackgoundColor, CellBorderPosition, CellBoxSizing, CellIconPosition, CellTheme, CellType, ColViewMeta, ColumnCustomHeaderResult, ColumnHeaderMeta, FormattedResult, IconTheme, Position, TextTheme } from "../common/interface";
import { calcuateIconVerticalPosition, calcuateTextHorizontalPosition, calcuateTextIconHorizontalPosition, calcuateTextVerticalPosition } from "../common/utils";
import { Cell } from "./cell";

export class ColCell extends Cell<ColViewMeta> {
  updateState(type: InteractionType): void {
    
    // throw new Error("Method not implemented.");
  }
  protected renderCell(): void {
    this.resetTextAndIconShape();
    this.initIconConfig();

    this.renderBackgroundShape();
    this.renderInteractiveBackground();
    this.renderInterativeBorder();
    this.renderTextShape();
    this.renderIconShape();
    this.renderBorders();
    this.renderResizeShape();
    this.renderExpandIconShape();
    this.update();
  }

  columnHeaderMeta: ColumnHeaderMeta;
  protected handleRestOptions(...[columnHeaderMeta]: [ColumnHeaderMeta]): void {
    this.columnHeaderMeta = columnHeaderMeta;
  }

  protected initIconConfig() {
    // TODO: S2 generateIconConfig
  }



  protected update(): void {
    // throw new Error("Method not implemented.");
  }

  protected getFormattedResult(): FormattedResult {
    const { column } = this.meta

    const title = typeof column.title === 'function' ? column.title() : (column.title || '');

    return {
      formattedText: title,
      value: title
    }
  }
  protected getViewTextMaxWidth(): number {
    const { width } = this.getCellBBox(CellBoxSizing.CONTENT_BOX);
    return width - this.getCellIconWidth();
  }

  protected getTextStyle(): TextTheme {
    const textStyle = this.sheet.theme.colCell.text;

    // 兼容 css 的样式处理，将 css 的样式转换成 text theme。
    const customCellStyle = this.getCustomCell()?.style ?? {} as CSSStyleDeclaration;
    const pickedTextStyle = Object.keys(textStyle).reduce<any>((result, key) => {
      const value = customCellStyle[key as keyof CSSStyleDeclaration]
      if (value) {
        result[key] = value
      }
      return result
    }, {}) as TextTheme;

    if (customCellStyle.color) {
      pickedTextStyle.fill = customCellStyle.color;
    }

    const style = {
      ...textStyle,
      ...pickedTextStyle
    }

    // antv/g textBaseline对应 css 的 verticalAlign
    style.textBaseline = style.verticalAlign
    return style
  }
  protected getTextPosition(): Position {
    const { isLeaf } = this.meta;
    const textStyle = this.getTextStyle();
    const contentBBox = this.getCellBBox(CellBoxSizing.CONTENT_BOX);
    const iconStyle = this.getIconStyle();

    const textY = calcuateTextVerticalPosition(contentBBox, textStyle.verticalAlign);

    if (isLeaf) {
      const textX = calcuateTextHorizontalPosition(
        contentBBox,
        this.viewTextWidth,
        textStyle.textAlign,
        iconStyle,
        this.cellIcon
      )

      return { x: textX, y: textY }
    }

    // TODO: 分组单元格的绘制逻辑。
    // const { width, scrollX } = this.columnHeaderMeta;
    // 有点麻烦啊
    return {
      x: 0,
      y: 0
    }
  }

  protected getIconStyle(): IconTheme {
    return this.sheet.theme.colCell.icon
  }

  protected getIconPosition(): CellIconPosition {
    const { isLeaf } = this.meta;
    const iconStyle = this.getIconStyle();
    const textStyle = this.getTextStyle();

    if (isLeaf) {
      const contextBBox = this.getCellBBox(CellBoxSizing.CONTENT_BOX);
      const textY = calcuateTextVerticalPosition(contextBBox, textStyle.verticalAlign);

      const { leftIconX = 0, rightIconX = 0 } = calcuateTextIconHorizontalPosition(
        contextBBox,
        this.viewTextWidth,
        textStyle.textAlign,
        iconStyle,
        this.cellIcon
      );
      const iconY = calcuateIconVerticalPosition(
        iconStyle.size ?? 0,
        textY,
        textStyle.fontSize ?? 0,
        textStyle.verticalAlign
      )
      return {
        left: { x: leftIconX, y: iconY },
        right: { x: rightIconX, y: iconY }
      }
    }

    // TODO:
    return {
      left: { x: 0, y: 0 },
      right: { x: 0, y: 0 }
    }
  }

  protected getStyle(): CellTheme {
    return this.sheet.theme.colCell.cell;
  }

  protected getBorderPositions(): CellBorderPosition[] {
    return [CellBorderPosition.BOTTOM, CellBorderPosition.RIGHT]
  }

  private getCustomCell(): ColumnCustomHeaderResult | null {
    const { column } = this.meta;

    const customHeaderCell = column.customHeaderCell

    if (!customHeaderCell) return null;

    return customHeaderCell(column)
  }

  protected getBackgroundColor(): BackgoundColor {
    const { backgroundColorOpacity, backgroundColor } = this.getStyle();

    // 兼容 css 的样式处理，将 css 的样式转换成 text theme。
    const customCellStyle = this.getCustomCell()?.style ?? {} as CSSStyleDeclaration;
    const pickedBackgroundStyle = ['background', 'backgroundColor', 'opacity'].reduce<any>((result, key) => {
      const value = customCellStyle[key as keyof CSSStyleDeclaration]
      if (value) {
        result[key] = value
      }
      return result
    }, {}) as CSSStyleDeclaration;
    if (customCellStyle.color) {
      pickedBackgroundStyle.fill = customCellStyle.color;
    }

    return {
      backgroundColor: pickedBackgroundStyle.backgroundColor || pickedBackgroundStyle.background || backgroundColor,
      backgroundColorOpacity: pickedBackgroundStyle.opacity !== undefined ? Number(pickedBackgroundStyle.opacity) : backgroundColorOpacity,
      intelligentReverseTextColor: false, // TODO:
    }
  }

  get cellType(): CellType {
    return CellType.COL_CELL;
  }

  // ======== 待实现功能 ========

  protected renderResizeShape() {
    // TODO: S2 drawResizeArea
  }

  protected renderExpandIconShape() {
    // TODO: S2 addExpandColumnIconShapes
  }

  protected isFrozenCell() {
    // TODO: S2 等待实现
  }
}
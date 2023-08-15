import { BackgoundColor, CellBorderPosition, CellBoxSizing, CellIconPosition, CellTheme, CellType, ColumnCustomCellResult, ColumnCustomRenderOption, FormattedResult, IconTheme, Position, TextTheme, ViewMeta } from "../common/interface";
import { calcuateIconVerticalPosition, calcuateTextHorizontalPosition, calcuateTextIconHorizontalPosition, calcuateTextVerticalPosition } from "../common/utils";
import { Cell } from "./cell";
import { isNil } from 'lodash-es'

export class DataCell extends Cell<ViewMeta> {

  setMeta(meta: ViewMeta) {
    super.setMeta(meta);
    this.renderCell();
  }

  protected initIconConfig() {
    // TODO:
  }

  // 获取占位符
  protected getEmptyPlaceholder(): string | number {
    const { config: { transformCellText } } = this.sheet;

    if (!transformCellText) return ''

    if (typeof transformCellText !== 'function') {
      return transformCellText;
    }

    const { column, record, rowIndex } = this.meta

    return transformCellText({ column, record, rowIndex })
  }


  // ========== 处理的事件 ============

  protected handleHover() {
  }

  // ========== 基于基类抽象的方法 ======
  protected renderCell(): void {
    this.resetTextAndIconShape();
    this.initIconConfig();
    this.renderBackgroundShape();
    this.renderInteractiveBackground();
    this.renderInterativeBorder();
    this.renderTextShape();
    this.renderIconShape();
    this.renderBorders();
    this.update();
  }

  protected update(): void {
    // throw new Error("Method not implemented.");
  }

  // 获取格式化的结果
  protected getFormattedResult(): FormattedResult {
    const { rowIndex, record, column } = this.meta;

    const customRender = column.customRender || (({ text }: ColumnCustomRenderOption) => text);
    const text = record?.[column.dataIndex] as string;

    const formattedValue = customRender({
      text,
      record,
      column,
      index: rowIndex
    });

    return {
      formattedText: isNil(formattedValue) ? '' : formattedValue.toString(),
      value: text
    }
  }

  protected getViewTextMaxWidth(): number {
    const { width } = this.getCellBBox(CellBoxSizing.CONTENT_BOX)
    // TODO: 还需要减去图标宽度
    return width;
  }

  private getCustomCell(): ColumnCustomCellResult | null {
    const { record, column, rowIndex } = this.meta;

    const customCell = column.customCell

    if (!customCell) return null;

    return customCell({ record, column, index: rowIndex })
  }

  protected getTextStyle(): TextTheme {
    const textStyle = this.sheet.theme.dataCell.text;

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

    return {
      ...textStyle,
      ...pickedTextStyle
    }
  }

  // 获取文字的位置
  protected getTextPosition(): Position {
    const contentBBox = this.getCellBBox(CellBoxSizing.CONTENT_BOX);
    const textStyle = this.getTextStyle();
    const iconStyle = this.getIconStyle();

    const textX = calcuateTextHorizontalPosition(
      contentBBox,
      this.viewTextWidth,
      textStyle.textAlign,
      iconStyle,
      this.cellIcon
    );

    const textY = calcuateTextVerticalPosition(contentBBox, textStyle.verticalAlign);

    return { x: textX, y: textY };
  }


  protected getIconStyle(): IconTheme {
    return this.sheet.theme.dataCell.icon;
  }

  protected getIconPosition(): CellIconPosition {
    const contentBBox = this.getCellBBox(CellBoxSizing.CONTENT_BOX);
    const textStyle = this.getTextStyle();
    const iconStyle = this.getIconStyle();

    const { leftIconX = 0, rightIconX = 0 } = calcuateTextIconHorizontalPosition(
      contentBBox,
      this.viewTextWidth,
      textStyle.textAlign,
      iconStyle,
      this.cellIcon
    );

    const textY = calcuateTextVerticalPosition(contentBBox, textStyle.verticalAlign);

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

  getLeftIconPosition(): Position | undefined {
    return this.getIconPosition().left
  }

  getRightIconPosition(): Position | undefined {
    return this.getIconPosition().right
  }

  protected getStyle(): CellTheme {
    return this.sheet.theme.dataCell.cell;
  }

  protected getBorderPositions(): CellBorderPosition[] {
    return [CellBorderPosition.BOTTOM, CellBorderPosition.RIGHT]
  }

  protected getBackgroundColor(): BackgoundColor {
    const { crossBackgroundColor, backgroundColorOpacity, backgroundColor } = this.getStyle();
    const rowIndex = this.meta.rowIndex;

    const background = crossBackgroundColor && rowIndex % 2 === 0
      ? crossBackgroundColor
      : backgroundColor;

    // 兼容 css 的样式处理，将 css 的样式转换成 text theme。
    const customCellStyle = this.getCustomCell()?.style ?? {} as CSSStyleDeclaration;
    const pickedBackgroundStyle = ['background', 'backgroundColor', 'opacity'].reduce<any>((result, key) => {
      result[key] = customCellStyle[key as keyof CSSStyleDeclaration]
      return result
    }, {}) as CSSStyleDeclaration;
    pickedBackgroundStyle.fill = customCellStyle.color;

    // TODO: 智能反转颜色

    return {
      backgroundColor: pickedBackgroundStyle.backgroundColor || pickedBackgroundStyle.background || background,
      backgroundColorOpacity: pickedBackgroundStyle.opacity !== undefined ? Number(pickedBackgroundStyle.opacity) : backgroundColorOpacity,
      intelligentReverseTextColor: false, // TODO:
    }
  }

  get cellType(): CellType {
    return CellType.DATA_CELL
  }

}
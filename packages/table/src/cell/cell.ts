import { DisplayObject, Group, Rect } from "@antv/g";
import { BackgoundColor, BaseViewMeta, CellBorderPosition, CellBoxSizing, CellIconPosition, CellIcons, CellInteractiveType, CellTheme, CellType, FormattedResult, IconTheme, Padding, Position, SimpleBBox, TextTheme } from "../common/interface";
import { Sheet } from "../sheet";
import { ELLIPSIS_SYMBOL } from "../common/constant";
import { TextView } from "../ui/TextView";
import { renderLine, renderRect, renderTextView } from "../shared";
import { calcuateCellBorderStyle } from "../common/utils";

export abstract class Cell<Meta extends BaseViewMeta = any> extends Group {
  // 当前单元格的元信息
  protected meta: Meta;
  getMeta() {
    return this.meta;
  }
  setMeta(meta: Meta) {
    this.meta = meta;
  }

  // 从数据拿到的原始文本
  getOriginalText() {
    return this.getFormattedResult().formattedText;
  }

  // 用户查看的文本
  protected viewText: string;
  protected viewTextWidth = 0;
  getViewText() {
    return this.viewText;
  }

  // 交互状态的图形
  protected interactiveShapes = new Map<CellInteractiveType, DisplayObject>();

  protected sheet: Sheet;

  protected backgroudShape: Rect;

  // 文本
  protected textShape: TextView;
  protected textShapes: TextView[];
  getTextShape() {
    return this.textShape;
  }
  getTextShapes() {
    return this.textShapes || [this.textShape]
  }
  addTextShape(textShape: TextView) {
    this.textShapes.push(textShape)
  }

  // 图标
  cellIcon: CellIcons;

  protected getCellIconWidth(): number {
    // TODO: getActionAndConditionIconWidth
    return 0
  }

  constructor(sheet: Sheet, meta: Meta, ...restOptions: unknown[]) {
    super({});
    this.meta = meta;
    this.sheet = sheet;
    this.handleRestOptions(...restOptions);
    this.init();
  }

  protected init() {
    // TODO:
    if (!this.ready()) return;

    this.renderCell();
  }

  protected ready() {
    const { width, height } = this.meta;

    return width > 0 && height > 0
  }

  protected handleRestOptions(...options: unknown[]) {
  }

  // 获取占位符
  protected getEmptyPlaceholder(): string | number {
    const { config: { transformCellText } } = this.sheet;

    if (!transformCellText) return ''

    if (typeof transformCellText !== 'function') {
      return transformCellText;
    }

    const { column } = this.meta

    return transformCellText({ column, record: {}, rowIndex: -1 })
  }

  // 获取省略的文字
  protected getEllipsisText(
    text: string | number | null | undefined,
    maxWidth: number,
    textTheme: TextTheme,
    emptyPlaceholder: string
  ) {
    if (text == null || text === undefined) return emptyPlaceholder;

    const { measureTextWidth } = this.sheet;

    // 如果文字本身没有超过单元格宽度，则直接返回文本。
    const font = textTheme as any as CSSStyleDeclaration
    if (measureTextWidth(text, font) <= maxWidth) return text;

    // 省略号的宽度
    const ellipsis_width = measureTextWidth(ELLIPSIS_SYMBOL, font);

    const wholeText = text.toString();
    const wholeTextLength = wholeText.length;
    const wholeTextCenterIndex = Math.ceil(wholeTextLength / 2) - 1;

    let leftText = wholeText.substring(0, wholeTextCenterIndex);
    let leftTextWidth = measureTextWidth(leftText, font);
    let rightText = wholeText.substring(wholeTextCenterIndex, wholeTextLength);
    let halfRightText = '';

    // 二分法求省略的字符串
    while (rightText) {
      // 如果恰巧中间文本为极限宽度，则直接返回
      if (leftTextWidth + ellipsis_width === maxWidth) {
        return leftText + ELLIPSIS_SYMBOL;
      }

      if (leftTextWidth + ellipsis_width > maxWidth) {
        const leftTextCenterIndex = Math.ceil(leftText.length / 2) - 1;
        rightText = leftText.substring(leftTextCenterIndex, leftText.length)
        leftText = leftText.substring(0, leftTextCenterIndex);
        leftTextWidth = measureTextWidth(leftText, font);
      } else {
        const rightTextCenterIndex = Math.ceil(rightText.length / 2) - 1;
        halfRightText = rightText.substring(0, rightTextCenterIndex);

        if (!halfRightText) {
          return leftText + halfRightText + ELLIPSIS_SYMBOL;
        }

        const tempWidth = leftTextWidth + measureTextWidth(halfRightText, font) + ellipsis_width

        if (tempWidth === maxWidth) {
          return leftText + halfRightText + ELLIPSIS_SYMBOL;
        } else if (tempWidth > maxWidth) {
          rightText = halfRightText.substring(0, rightTextCenterIndex);
        } else {
          rightText = rightText.substring(rightTextCenterIndex, rightText.length);
          leftText = leftText + halfRightText;
          leftTextWidth = measureTextWidth(leftText, font);
        }
      }
    }

    return leftText + ELLIPSIS_SYMBOL;
  }

  // 渲染文字
  protected renderTextShape() {
    // 获取文字、展示的最大宽度和样式。
    const { formattedText } = this.getFormattedResult();

    const viewTextMaxWidth = this.getViewTextMaxWidth();
    const textStyle = this.getTextStyle();

    const { measureTextWidth } = this.sheet;

    const emptyPlaceholder = this.getEmptyPlaceholder();

    // 计算可视文本
    const viewText = this.getEllipsisText(formattedText, viewTextMaxWidth, textStyle, emptyPlaceholder.toString());
    this.viewText = viewText.toString();
    this.viewTextWidth = measureTextWidth(this.viewText, textStyle as any as CSSStyleDeclaration);


    // 渲染文字
    const textPosition = this.getTextPosition();

    this.textShape = renderTextView(this, this.textShape, {
      text: this.viewText,
      ...textPosition,
      ...textStyle
    });

    // TODO: 需要弄清楚为什么要创建文字形状数组
    this.textShapes.push(this.textShape);
  }

  // 绘制单元格背景颜色
  protected renderBackgroundShape() {
    const { backgroundColor: fill, backgroundColorOpacity: fillOpacity } = this.getBackgroundColor();

    this.backgroudShape = renderRect(this, {
      ...this.getCellBBox(),
      fill,
      fillOpacity
    })
  }

  protected renderBorders() {
    for (const position of this.getBorderPositions()) {
      const style = calcuateCellBorderStyle(position, this.getCellBBox(), this.getStyle())
      renderLine(this, style);
    }
  }

  protected renderIconShape() {
    // TODO: s2 drawConditionIconShapes
  }

  protected renderInteractiveBackground() {
    this.interactiveShapes.set(CellInteractiveType.Background, renderRect(this, {
      ...this.getCellBBox(),
      visibility: 'hidden'
    }))
  }

  protected renderInterativeBorder() {
    this.interactiveShapes.set(CellInteractiveType.Border, renderRect(this, {
      ...this.getCellBBox(CellBoxSizing.PADDING_BOX),
      visibility: 'hidden'
    }))
  }

  protected hideInteractiveShapes() {
    // 核对: s2 hideInteractionShape
    this.interactiveShapes.forEach(shape => shape.style.setProperty('visibility', 'hidden'))
  }

  // 获取单元格的 bbox
  getCellBBox(type = CellBoxSizing.BORDER_BOX) {
    let { x, y, height, width } = this.meta
    const bbox = { x, y, height, width }

    if (type === CellBoxSizing.BORDER_BOX) {
      return bbox;
    }

    const cellStyle = this.getStyle();

    let { padding = { top: 0, bottom: 0, left: 0, right: 0 }, horizontalBorderWidth = 0, verticalBorderWidth = 0 } = cellStyle
    const horizontalBorder = this.getBorderPositions().filter(position =>
      [CellBorderPosition.LEFT, CellBorderPosition.RIGHT].includes(position)
    );
    const verticalBorder = this.getBorderPositions().filter(position =>
      [CellBorderPosition.TOP, CellBorderPosition.BOTTOM].includes(position)
    );

    y += verticalBorder.filter(position => position === CellBorderPosition.TOP).length * verticalBorderWidth;
    height -= verticalBorder.length * verticalBorderWidth;
    x += horizontalBorder.filter(position => position === CellBorderPosition.RIGHT).length * horizontalBorderWidth;
    width -= (horizontalBorder.length + 1) * horizontalBorderWidth;

    if (typeof padding === 'number') {
      padding = {
        top: padding,
        right: padding,
        bottom: padding,
        left: padding
      }
    }

    if (type === CellBoxSizing.CONTENT_BOX) {
      x += padding.left ?? 0
      y += padding.top ?? 0
      width -= (padding.left ?? 0) + (padding.right ?? 0);
      height -= (padding.top ?? 0) + (padding.bottom ?? 0);
    }

    return {
      x, y, width, height
    }
  }

  protected resetTextShape() {
    this.textShapes = [];
  }

  protected resetIconShape() {
    // TODO: resetTextAndConditionIconShapes
  }

  protected resetTextAndIconShape() {
    this.resetTextShape();
    this.resetIconShape();
  }


  /* 
  * ============= 抽象方法 ============ 
  **/

  // 渲染单元格
  protected abstract renderCell(): void;

  protected abstract update(): void;

  // 获取格式化的文本
  protected abstract getFormattedResult(): FormattedResult;

  // 获取可见文本的最大宽度
  protected abstract getViewTextMaxWidth(): number;

  // 获取文本样式
  protected abstract getTextStyle(): TextTheme;

  protected abstract getTextPosition(): Position;

  protected abstract getIconStyle(): IconTheme;

  protected abstract getIconPosition(): CellIconPosition;

  protected abstract getStyle(): CellTheme;

  protected abstract getBorderPositions(): CellBorderPosition[];

  protected abstract getBackgroundColor(): BackgoundColor;

  abstract get cellType(): CellType;
}
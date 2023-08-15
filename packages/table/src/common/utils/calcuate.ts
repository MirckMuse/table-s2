import { CellIcons, IconTheme, SimpleBBox, TextAlign, VerticalAlign } from "../interface";

export function calcuateIconsWidth(iconsLength: number, iconStyle: IconTheme, position: 'left' | 'right'): number {
  return 0;
}

interface HorizontalCalcuateOptions {
  startX: number;

  textWidth: number;

  leftIconWidth: number;

  rightIconWidth: number;

  iconStyle: IconTheme;

  bbox: SimpleBBox,
}

interface HorizontalCalcuateResult {
  textX: number;

  leftIconX?: number;

  rightIconX?: number;
}

// 因为文本居中类型的不同，所以需要不同策略的计算逻辑
const HorizontalCalcuateStrategy: Record<TextAlign, (options: HorizontalCalcuateOptions) => HorizontalCalcuateResult> = {
  left(options) {
    const { startX, leftIconWidth, rightIconWidth, textWidth, iconStyle } = options

    const iconMarginLeft = (iconStyle.margin?.left ?? 0)
    const iconMarginRight = (iconStyle.margin?.right ?? 0)

    return {
      leftIconX: startX,
      textX: startX + leftIconWidth + iconMarginRight,
      rightIconX: startX + leftIconWidth + textWidth + iconMarginRight + rightIconWidth + iconMarginLeft
    }
  },
  right(options) {
    const { startX, leftIconWidth, rightIconWidth, textWidth, iconStyle, bbox } = options;

    const iconMarginLeft = (iconStyle.margin?.left ?? 0)
    const iconMarginRight = (iconStyle.margin?.right ?? 0)

    const textX = startX + bbox.width - rightIconWidth;
    return {
      textX,
      leftIconX: textX - textWidth - leftIconWidth - iconMarginRight,
      rightIconX: startX + bbox.width - rightIconWidth - iconMarginLeft
    }
  },
  center(options) {
    const { startX, leftIconWidth, rightIconWidth, textWidth, iconStyle, bbox } = options;

    const iconMarginLeft = (iconStyle.margin?.left ?? 0)
    const iconMarginRight = (iconStyle.margin?.right ?? 0)

    const totalWidth = iconMarginLeft + iconMarginRight + leftIconWidth + rightIconWidth + textWidth;
    const leftIconX = startX + bbox.width / 2 - totalWidth / 2;
    const textX = leftIconX + leftIconWidth + iconMarginRight;
    const rightIconX = textX + textWidth + iconMarginLeft;

    return {
      leftIconX,
      textX,
      rightIconX
    }
  }
}

// 计算文本、图表在水平方向上的坐标
export function calcuateTextIconHorizontalPosition(
  bbox: SimpleBBox,
  textWidth: number,
  textAlign: TextAlign,
  iconStyle: IconTheme,
  icon: CellIcons
) {
  const leftIconWidth = calcuateIconsWidth(icon.left?.length ?? 0, iconStyle, 'left');
  const rightIconWidth = calcuateIconsWidth(icon.right?.length ?? 0, iconStyle, 'right');

  const strategy = HorizontalCalcuateStrategy[textAlign] || HorizontalCalcuateStrategy.left;

  return strategy({
    startX: bbox.x,
    bbox,
    leftIconWidth,
    rightIconWidth,
    textWidth,
    iconStyle
  })
}

// 计算文本在水平方向上的坐标
export function calcuateTextHorizontalPosition(
  bbox: SimpleBBox,
  textWidth: number,
  textAlign: TextAlign,
  iconStyle: IconTheme,
  icon: CellIcons
) {
  const leftIconWidth = calcuateIconsWidth(icon?.left?.length ?? 0, iconStyle, 'left');
  const rightIconWidth = calcuateIconsWidth(icon?.right?.length ?? 0, iconStyle, 'right');

  const strategy = HorizontalCalcuateStrategy[textAlign] || HorizontalCalcuateStrategy.left;

  return strategy({
    startX: bbox.x,
    bbox,
    leftIconWidth,
    rightIconWidth,
    textWidth,
    iconStyle
  }).textX
}

// 计算文本在垂直方向上的坐标
export function calcuateTextVerticalPosition(
  bbox: SimpleBBox,
  verticalAlign: VerticalAlign
) {
  const { y, height } = bbox;

  switch (verticalAlign) {
    case 'top':
      return y;
    case 'middle':
      return y + height / 2;
    default:
      return y + height;
  }
}

// 计算图标在垂直方向上的坐标
export function calcuateIconVerticalPosition(
  iconSize: number,
  textY: number,
  textFontSize: number,
  textVerticalAlign: VerticalAlign
) {
  const offset = (textFontSize - iconSize) / 2;

  switch (textVerticalAlign) {
    case 'top':
      return textY + offset;
    case 'middle':
      return textY - iconSize / 2;
    default:
      return textY - offset - iconSize;
  }
}

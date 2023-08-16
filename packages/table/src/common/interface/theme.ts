import { CellType } from "./cell";

export interface SplitLine {
  /* 水平分割线颜色 */
  horizontalBorderColor?: string;

  /* 水平分割线颜色透明度 */
  horizontalBorderColorOpacity?: number;

  /* 水平分割线宽度 */
  horizontalBorderWidth?: number;

  /* 垂直分割线颜色 */
  verticalBorderColor?: string;

  /* 垂直分割线颜色透明度 */
  verticalBorderColorOpacity?: number;

  /* 垂直分割线宽度 */
  verticalBorderWidth?: number;

  /* 分割线是否显示外阴影 */
  showShadow?: boolean;

  /* 阴影宽度 */
  shadowWidth?: number;

  /* 阴影线性渐变色 */
  shadowColors?: {
    /* 线性变化左侧颜色 */
    left: string;

    /* 线性变化右侧颜色 */
    right: string;
  };
}

export interface ScrollbarTheme {
  size?: number;

  hoverSize?: number;

  thumbMinLength?: number;

  lineCap?: CanvasLineCap;

  trackColor?: string;

  thumbColor?: string;

  hoverThumbColor?: string;
}

export interface BackgroundTheme {
  opacity?: number;

  color?: string;
}

export interface CellTheme {
  verticalBorderWidth?: number;

  verticalBorderColorOpacity?: number;

  verticalBorderColor?: string;

  horizontalBorderWidth?: number;

  horizontalBorderColorOpacity?: number;

  horizontalBorderColor?: string;

  backgroundColor?: string;

  backgroundColorOpacity?: number;
}

// 文本内容的水平对齐方式, 默认 left
export type TextAlign = 'left' | 'center' | 'right';

// 绘制文本时的基线, 对应垂直方向对齐方式 默认 bottom
export type VerticalAlign = 'top' | 'middle' | 'bottom';

export interface TextAlignStyle {
  textAlign: TextAlign;

  verticalAlign: VerticalAlign;

  // 文本内容的水平对齐方式, 默认 left
}

// rome-ignore lint/suspicious/noEmptyInterface: <explanation>
export interface DataCellTheme extends DefaultCellTheme {
}

// rome-ignore lint/suspicious/noEmptyInterface: <explanation>
export interface ColCellTheme extends DefaultCellTheme {
}

type CellThemes = {
  [K in CellType]?: DefaultCellTheme
}

export interface Theme extends CellThemes {
  splitLine?: SplitLine;
}

export interface DefaultCellTheme {
  /* 常规样式 */
  text?: TextTheme;

  /* 粗体文本样式 */
  bolderText?: TextTheme;

  /* 单元格样式 */
  cell?: CellTheme;

  /* 图标样式 */
  icon?: IconTheme;
}

export interface Padding {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export type Margin = Padding;

export interface CellTheme {
  /* 奇数行单元格背景色 */
  crossBackgroundColor?: string;

  /* 单元格背景色 */
  backgroundColor?: string;

  /* 单元格背景色透明度 */
  backgroundColorOpacity?: number;

  /* 单元格水平边线颜色 */
  horizontalBorderColor?: string;

  /* 单元格水平边线颜色透明度 */
  horizontalBorderColorOpacity?: number;

  /* 单元格垂直边线颜色 */
  verticalBorderColor?: string;

  /* 单元格垂直边线颜色透明度 */
  verticalBorderColorOpacity?: number;

  /* 单元格水平边线宽度 */
  horizontalBorderWidth?: number;

  /* 单元格垂直边线宽度 */
  verticalBorderWidth?: number;

  /* 单元格内边距 */
  padding?: number | Padding;

  // /* 交互态 */
  // interactionState?: InteractionState;
}

export interface IconTheme {
  fill?: string;

  /* 下跌 icon 填充色 */
  downIconColor?: string;

  /* 上涨 icon 填充色 */
  upIconColor?: string;

  /* icon  大小 */
  size?: number;

  /* icon 外边距 */
  margin?: Margin;
}

export interface TextTheme extends TextAlignStyle {
  /* 字体 */
  fontFamily?: string;

  /* 字体大小 */
  fontSize?: number;

  /* 字体粗细 */
  fontWeight?: number | 'normal' | 'bold' | 'bolder' | 'lighter';

  /* 字体颜色 */
  fill?: string;

  /* 链接文本颜色 */
  linkTextFill?: string;

  /* 字体透明度 */
  opacity?: number;

  textBaseline?: VerticalAlign;
}
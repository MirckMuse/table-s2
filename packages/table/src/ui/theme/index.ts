import type { SplitLine, Theme, ScrollbarTheme, BackgroundTheme, DataCellTheme, TextTheme, IconTheme } from "../../common/interface";
import type { Sheet } from "table/src/sheet";

import { extend, merge } from "lodash-es";

export class AbstractTheme<T> {
  theme: Theme;

  constructor(theme: Theme) {
    this.theme = theme;
  }

  merge(theme?: T) {
    if (!theme) return

    merge(this, theme)
  }
}
export class BaseSplitLine extends AbstractTheme<SplitLine> implements SplitLine {
  horizontalBorderColor = 'red';
  horizontalBorderWidth = 1;
  horizontalBorderColorOpacity = 1;

  verticalBorderColor = 'red'
  verticalBorderColorOpacity = 1;
  verticalBorderWidth = 1;

  showShadow = false;
  shadowWidth = 4;

  shadowColors = {
    left: 'red',
    right: 'red'
  }
}

export const DefaultScrollbarTheme: ScrollbarTheme = {
  size: 6
}

export class BaseScrollbar extends AbstractTheme<ScrollbarTheme> implements ScrollbarTheme {
  size: 6;

  thumbMinLength: number;
}

export class BaseBackground extends AbstractTheme<BackgroundTheme> implements BackgroundTheme {
  color = '#F0F0F0';

  opacity = 1;
}

export class BaseDataCell extends AbstractTheme<DataCellTheme> implements DataCellTheme {
  cell: any = {};

  text: TextTheme;

  icon: IconTheme;
}

export class BaseTheme implements Theme {
  name: 'BaseTheme';

  sheet: Sheet;

  splitLine: BaseSplitLine = new BaseSplitLine(this);

  scrollbar: BaseScrollbar = new BaseScrollbar(this);

  background: BaseBackground = new BaseBackground(this);

  dataCell: BaseDataCell = new BaseDataCell(this);

  constructor(sheet: Sheet) {
    this.sheet = sheet;
  }

  updateTheme(theme: Theme) {
    this.splitLine.merge(theme.splitLine)
    // TODO:
  }

  static getHorizontalBorderWidth(sheet: Sheet) {
    return sheet.theme.splitLine.horizontalBorderWidth
  }

  static getVerticalBorderWidth() {
  }
}
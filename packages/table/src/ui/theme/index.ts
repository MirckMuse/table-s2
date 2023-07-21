import type { SplitLine, Theme, ScrollbarTheme } from "../../common/interface";
import type { Sheet } from "table/src/sheet";

import { merge } from "lodash-es";

export class BaseSplitLine implements SplitLine {
  theme: Theme;

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

  constructor(theme: Theme) {
    this.theme = theme;
  }

  merge(splitLine?: SplitLine) {
    if (!splitLine) return

    merge(this, splitLine)
  }
}

export const DefaultScrollbarTheme: ScrollbarTheme = {
  size: 6
}

export class BaseScrollbar implements ScrollbarTheme {
  theme: Theme;

  size: 6;

  thumbMinLength: number;

  constructor(theme: Theme) {
    this.theme = theme;
  }
}

export class BaseTheme implements Theme {
  name: 'BaseTheme';

  sheet: Sheet;

  splitLine: BaseSplitLine = new BaseSplitLine(this);

  scrollbar: BaseScrollbar = new BaseScrollbar(this);

  constructor(sheet: Sheet) {
    this.sheet = sheet
  }

  updateTheme(theme: Theme) {
    this.splitLine.merge(theme.splitLine)
  }

  static getHorizontalBorderWidth(sheet: Sheet) {
    return sheet.theme.splitLine.horizontalBorderWidth
  }

  static getVerticalBorderWidth() {
  }
}
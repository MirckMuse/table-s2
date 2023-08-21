import type { Sheet } from "table/src/sheet";
import type { BackgroundTheme, CellTheme, ColCellTheme, DataCellTheme, IconTheme, ScrollbarTheme, SplitLine, TextTheme, Theme } from "../../common/interface";

import { merge } from "lodash-es";

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

// TODO:
export class BaseScrollbar extends AbstractTheme<ScrollbarTheme> implements ScrollbarTheme {
  size = 6;

  hoverSize = 6;

  thumbMinLength = 80;

  lineCap?: CanvasLineCap = 'square';

  trackColor = 'transparent';

  thumbColor = '#737779';

  hoverThumbColor = 'green';
}

export class BaseBackground extends AbstractTheme<BackgroundTheme> implements BackgroundTheme {
  color = '#F0F0F0';

  opacity = 1;
}

export class BaseDataCell extends AbstractTheme<DataCellTheme> implements DataCellTheme {
  cell: CellTheme = {
    verticalBorderColor: '#F0F0F0',
    verticalBorderColorOpacity: 1,
    verticalBorderWidth: 0,
    horizontalBorderColor: '#F0F0F0',
    horizontalBorderColorOpacity: 1,
    horizontalBorderWidth: 1,
    backgroundColor: '#FFF',
    backgroundColorOpacity: 1
  };

  text: TextTheme = {
    fontFamily: 'PingFang SC',
    textAlign: 'center',
    verticalAlign: "middle",
    fontSize: 14,
    fontWeight: 400,
    fill: '#040B29',
    linkTextFill: 'blue',
    opacity: 1
  };

  // TODO:
  icon: IconTheme = {
    fill: 'red',
    size: 16,
    margin: {
      top: 4,
      right: 4,
      bottom: 4,
      left: 4
    }
  };
}

export class BaseColCell extends AbstractTheme<ColCellTheme> implements ColCellTheme {
  cell: CellTheme = {
    verticalBorderColor: '#E6E7EC',
    verticalBorderColorOpacity: 1,
    verticalBorderWidth: 1,
    horizontalBorderColor: '#E6E7EC',
    horizontalBorderColorOpacity: 1,
    horizontalBorderWidth: 1,

    backgroundColor: '#FAFAFA',
    backgroundColorOpacity: 1
  };

  text: TextTheme = {
    fontFamily: 'PingFang SC',
    textAlign: 'center',
    verticalAlign: "middle",
    fontSize: 14,
    fontWeight: 700,
    fill: '#040B29',
    linkTextFill: 'blue',
    opacity: 1
  };

  // TODO:
  icon: IconTheme = {
    fill: 'red',
    size: 16,
    margin: {
      top: 4,
      right: 4,
      bottom: 4,
      left: 4
    }
  };
}

export class BaseTheme implements Theme {
  name: 'BaseTheme';

  sheet: Sheet;

  splitLine: BaseSplitLine = new BaseSplitLine(this);

  scrollbar: BaseScrollbar = new BaseScrollbar(this);

  background: BaseBackground = new BaseBackground(this);

  dataCell: BaseDataCell = new BaseDataCell(this);

  colCell: BaseColCell = new BaseColCell(this);

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
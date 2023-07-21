import { Group, DisplayObjectConfig, GroupStyleProps } from '@antv/g'
import type { Sheet } from '../sheet'

export type GridGroupConfig = DisplayObjectConfig<GroupStyleProps> & {
  sheet: Sheet
}

export class GridGroup extends Group {
  protected sheet: Sheet;

  constructor(config: GridGroupConfig) {
    const { sheet, ...rest } = config
    super(rest)
    this.sheet = sheet
  }
}
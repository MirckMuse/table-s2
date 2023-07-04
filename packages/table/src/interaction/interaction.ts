import type { OverscrollBehavior } from "../common/interface";
import type { Sheet } from "../sheet";
import { Tooltip } from "./tooltip";

export class Interaction {
  sheet: Sheet;

  constructor(sheet: Sheet) {
    this.sheet = sheet
    this.init()
  }

  destroy() {
    this.restoreOverscrollBehavior()
  }

  protected init() {
    this.initOverscrollBehavior()
  }

  // ======== 滚动条行为 ===============
  private overscrollBehaviorKey = 'overscrollBehavior'

  // 初始化滚动条的行为
  protected initOverscrollBehavior() {
    const { overscrollBehavior } = this.sheet.getConfig().interaction ?? {}

    const bodyOverscrollBehavior = window
      .getComputedStyle(document.body)
      .getPropertyValue('overscroll-behavior') as OverscrollBehavior;

    const isUserResetOverscrollBehavior = bodyOverscrollBehavior && bodyOverscrollBehavior !== 'auto'

    if (isUserResetOverscrollBehavior) {
      this.sheet.store.set(this.overscrollBehaviorKey, bodyOverscrollBehavior)
    } else if (overscrollBehavior) {
      document.body.style.overscrollBehavior = overscrollBehavior
    }
  }

  protected restoreOverscrollBehavior() {
    document.body.style.overscrollBehavior = this.sheet.store.get(this.overscrollBehaviorKey, '')
  }

  // ========== Tooltip ============

  tooltip: Tooltip;
}
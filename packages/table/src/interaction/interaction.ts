import { DefaultInteractionState, INTERACTION_STATE_KEY, InteractionType } from "../common/constant";
import type { InteractionState, OverscrollBehavior } from "../common/interface";
import type { Sheet } from "../sheet";
import { Tooltip } from "./tooltip";
import { EventController } from './event-controller'
import { HoverInteraction } from './hover';
import { BaseEvent } from "../event/base";
import { isMobile } from "../shared";

export class Interaction {
  sheet: Sheet;
  constructor(sheet: Sheet) {
    this.sheet = sheet;
    this.init();
  }

  destroy() {
    this.restoreOverscrollBehavior();
  }

  protected init() {
    this.initEventController();
    this.initOverscrollBehavior();
    this.initInteraction();
  }

  // 事件控制器
  eventController: EventController;
  protected initEventController() {
    this.eventController = new EventController(this.sheet);
  }

  // 交互事件
  interactionMap = new Map<string, BaseEvent>()
  protected initInteraction() {
    const defaultInteractions = this.getDefaultInteractions();

    defaultInteractions
      .filter(({ enable }) => enable !== false)
      .forEach(({ type, interaction: InteractionMeta }) => {
        this.interactionMap.set(type, new InteractionMeta(this.sheet))
      })
  }
  protected getDefaultInteractions() {
    return [
      { type: InteractionType.Hover, interaction: HoverInteraction, enable: !isMobile() }
    ]
  }

  // ======== 滚动条行为 ===============
  private overscrollBehaviorKey = 'overscrollBehavior'

  // 初始化滚动条的行为
  protected initOverscrollBehavior() {
    const { overscrollBehavior } = this.sheet.getConfig().interaction ?? {}

    const bodyOverscrollBehavior = window
      .getComputedStyle(document.body)
      .getPropertyValue('overscroll-behavior') as OverscrollBehavior;

    const isUserResetOverscrollBehavior = bodyOverscrollBehavior && bodyOverscrollBehavior !== 'auto';

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

  getState(): InteractionState {
    return this.sheet.store.get(INTERACTION_STATE_KEY) || DefaultInteractionState;
  }

  setState(interactionState: InteractionState) {
    this.clearState();
    this.sheet.store.set(INTERACTION_STATE_KEY, interactionState)
  }

  clearState() {
    // TODO: 清理状态
  }

  /**
   * ========== 暴露出的公共方法 ========
   */

  getCurrentStateName() {
    return this.getState().name
  }
}
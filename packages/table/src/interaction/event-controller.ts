import { FederatedPointerEvent } from "@antv/g";
import { OriginEventType } from "../common/interface";
import { BaseEvent } from "../event/base";
import { DataCell } from "../cell";
import { TableEvent } from "../common/constant";
import { createRequestAnimationEvent, isMobile } from "../shared";

export type EventHandler = (event: FederatedPointerEvent) => void;

export type AddEventListener = (event: string, handle: EventHandler) => void;

export type RemoveEventListener = (event: string, handle: EventHandler) => void;

export type Target = {
  addEventListener: AddEventListener,
  removeEventListener: RemoveEventListener,
}

interface Event {
  target: Target;

  type: string;

  handler: EventHandler;
}

export class EventController extends BaseEvent {
  events: Event[] = [];

  get canvas() {
    return this.sheet.canvas;
  }

  private onCanvasMousemove: EventHandler;

  private initEvents() {
    this.onCanvasMousemove = this.onCanvasMousemove || createRequestAnimationEvent((event: FederatedPointerEvent) => {
      const cell = this.sheet.getCell(event.target);
      if (cell instanceof DataCell) {
        this.sheet.emit(TableEvent.DATA_CELL_HOVER, event);
      }
    });
  }

  public bindEvents(): void {
    this.clearAllEvents();
    this.initEvents();

    if (isMobile()) return;

    this.addEventListener(this.canvas, OriginEventType.POINTER_MOVE, this.onCanvasMousemove);
  }

  public unbindEvents(): void {
    this.clearAllEvents();
  }


  // 新增一个事件
  protected addEventListener(target: Target, event: string, handler: EventHandler) {
    if (!target) return;

    target.addEventListener(event, handler);
    this.events.push({ target, type: event, handler });
  }

  // 移除一个事件
  protected removeEventListener(target: Target, event: string, handler: EventHandler) {
    target.removeEventListener(event, handler);

    const matchedIndex = this.events.findIndex(item => item.target === target && item.type === event && item.handler === handler);
    if (matchedIndex === -1) return;

    this.events.splice(matchedIndex, 1);
  }

  // 清理所有事件
  protected clearAllEvents() {
    this.events?.forEach(({ target, type, handler }) => target?.removeEventListener?.(type, handler));
    this.events = [];
  }
}
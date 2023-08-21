import { FederatedPointerEvent } from "@antv/g";
import { EventHandler } from "../interaction/event-controller";

// 基于 target 的锁。
const targetLockWeakMap = new WeakMap<FederatedPointerEvent, boolean>();

// 创建基于帧率的事件。
export function createRequestAnimationEvent(callback: EventHandler) {
  return (event: FederatedPointerEvent) => {
    if (targetLockWeakMap.get(event)) return;

    targetLockWeakMap.set(event, true);
    window.requestAnimationFrame(() => {
      callback(event);
      targetLockWeakMap.set(event, false);
    });
  }
}

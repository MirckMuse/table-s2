import type { Sheet } from "../../sheet";
import type { Adaptive, HdAdapter } from "../../ui";


export interface HdAdapterConfig {
  override?: (sheet: Sheet) => HdAdapter;
}

export interface AdaptiveConfig {
  override?: (sheet: Sheet) => Adaptive;

  // 水平方向上是否需要自适应
  horizontal?: boolean;

  // 垂直方向上是否需要自适应
  vertical?: boolean;
}


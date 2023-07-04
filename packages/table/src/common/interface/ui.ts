import type { Sheet } from "../../sheet";
import type { Adaptive, HdAdapter } from "../../ui";


export interface HdAdapterConfig {
  override?: (sheet: Sheet) => HdAdapter;
}
export interface AdaptiveConfig {
  override?: (sheet: Sheet) => Adaptive;
}


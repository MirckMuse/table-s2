import type { Interaction } from "../../interaction";
import type { Sheet } from "../../sheet";

export type OverscrollBehavior = 'auto' | 'none' | 'contain' | null;

export interface InteractionConfig {
  override?: (sheet: Sheet) => Interaction;

  overscrollBehavior?: OverscrollBehavior;
}
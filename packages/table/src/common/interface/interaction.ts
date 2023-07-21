import type { Interaction } from "../../interaction";
import type { Sheet } from "../../sheet";

export type OverscrollBehavior = 'auto' | 'none' | 'contain' | null;

export enum CellType {
  DATA_CELL = 'dataCell',
  SERIES_NUMBER_CELL = 'seriesNumberCell',
  MERGED_CELL = 'mergedCell',
}

export interface ScrollSpeedRatio {
  horizontal?: number;

  vertical?: number;
}

export interface Position {
  x: number;

  y: number;
}

export interface WheelOffset {
  deltaX?: number;
  deltaY?: number;
  offset?: number;
  offsetX: number;
  offsetY: number;
}

export interface ScrollOffset {
  scrollX?: number;

  scrollY?: number;
}

export enum ScrollbarPositionType {
  CONTENT = 'content',
  CANVAS = 'canvas',
}

export interface InteractionConfig {
  override?: (sheet: Sheet) => Interaction;

  overscrollBehavior?: OverscrollBehavior;

  scrollSpeedRatio?: number | ScrollSpeedRatio;

  scrollbarPosition?: ScrollbarPositionType;
}
import type { Interaction } from "../../interaction";
import type { Sheet } from "../../sheet";

export type OverscrollBehavior = 'auto' | 'none' | 'contain' | null;

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

export enum InteractionStateName {
  ALL_SELECTED = 'all_selected',
  SELECTED = 'selected',
  UNSELECTED = 'unselected',
  HOVER = 'hover',
  HOVER_FOCUS = 'hover_focus',
  HIGHLIGHT = 'highlight',
  SEARCH_RESULT = 'search_result',
  PREPARE_SELECT = 'prepare_select',
}

export interface CellMeta {
  id: string;

  dataIndex: string;

  rowIndex: number;

  [key: string]: unknown;
}

export type CellsMeta = Map<CellType, CellMeta[]>

export interface InteractionState {
  name?: InteractionStateName

  cellsMeta?: CellsMeta;

  force?: boolean;
}
import { InteractionState } from "../interface"

export const INTERACTION_STATE_KEY = 'INTERACTION_STATE_KEY'

export const DefaultInteractionState: InteractionState = {
  cellsMeta: new Map(),

  force: false
}

// 内置的交互类型
export enum InteractionType {
  Hover = 'hover'
}

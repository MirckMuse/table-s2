import type { Config } from "../interface";

export const MIN_DEVICE_PIXEL_RATIO = 1;

export const Default_Config: Readonly<Partial<Config>> = {
  hdAdapter: true,
  adaptive: true,
  supportsCSSTransform: false,

  interaction: {
    overscrollBehavior: 'auto'
  }
}
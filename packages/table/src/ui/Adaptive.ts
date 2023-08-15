import { MountElement } from "../common/interface";
import type { Sheet } from "../sheet";

// TODO: 监听 dom 的尺寸，然后更新表格的尺寸。
export class Adaptive {
  sheet: Sheet;

  horizontal: boolean;

  vertical: boolean;

  constructor(sheet: Sheet) {
    this.sheet = sheet;
    this.init();
  }

  protected init() {
    this.initConfig();
    this.createAdaptive();
  }

  observerDOM: MountElement;

  // 初始化配置，主要用来判断横向和纵向是否都需要自适应
  protected initConfig() {
    const adaptive = this.sheet.getConfig().adaptive;

    //  这里不需要判断有没有配置自适应参数，如果没有配置的话。不会创建该类的实例
    if (typeof adaptive === 'object') {
      this.horizontal = adaptive.horizontal ?? true;
      this.vertical = adaptive.vertical ?? true;
    } else if (typeof adaptive === 'boolean') {
      this.horizontal = true;
      this.vertical = true
    }
    this.observerDOM = this.sheet.mountDOM;
  }

  resizeObserver: ResizeObserver | null = null;
  protected createAdaptive() {
    this.resizeObserver = new ResizeObserver(() => {
      let { width, height } = this.observerDOM.getBoundingClientRect();
      if (!this.horizontal) {
        width = this.sheet.width ?? 0;
      }
      if (!this.vertical) {
        height = this.sheet.height ?? 0;
      }
      // FIXME: 目前更新会有闪烁现象
      this.sheet.resize(width, height);
    });
    this.resizeObserver.observe(this.observerDOM);
  }

  destroy() {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }
}
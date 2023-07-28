import type { Sheet } from "../sheet";

// TODO: 监听 dom 的尺寸，然后更新表格的尺寸。
export class Adaptive {
  sheet: Sheet;
  constructor(sheet: Sheet) {
    this.sheet = sheet
  }

  destroy() { }
}
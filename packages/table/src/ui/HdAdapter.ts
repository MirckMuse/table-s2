import type { Sheet } from "../sheet";

// TODO:
export class HdAdapter {

  sheet: Sheet;

  constructor(sheet: Sheet) {
    this.sheet = sheet
  }

  destroy() { }
}
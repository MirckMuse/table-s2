import type { Sheet } from "../sheet";

// TODO:
export class Adaptive {

  sheet: Sheet;

  constructor(sheet: Sheet) {
    this.sheet = sheet
  }

  destroy() { }
}
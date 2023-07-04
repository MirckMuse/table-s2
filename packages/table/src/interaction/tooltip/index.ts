import type { Sheet } from "../../sheet";

export class Tooltip {
  sheet: Sheet;

  constructor(sheet: Sheet) {
    this.sheet = sheet
  }
}
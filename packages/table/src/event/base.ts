import type { Sheet } from "../sheet";

export abstract class BaseEvent {
  sheet: Sheet;

  constructor(sheet: Sheet) {
    this.sheet = sheet;
    this.bindEvents()
  }

  public abstract bindEvents(): void;

  public abstract unbindEvents(): void;
}
import type { Sheet } from "../sheet";

import { Group } from "@antv/g";
import { Background_Group_Key, Background_Group_ZIndex, Foreground_Group_Key, Foreground_Group_ZIndex, Panel_Group_Key, Panel_Group_ZIndex } from "../common/constant";

export class Facet {
  sheet: Sheet;

  constructor(sheet: Sheet) {
    this.sheet = sheet
    this.init()
  }

  protected init() {
    this.initGroups()
  }

  backgroundGroup: Group;
  panelGroup: Group;
  foregroundGroup: Group;

  protected initGroups() {
    const sheetCanvas = this.sheet.getCanvas()

    this.backgroundGroup = sheetCanvas.appendChild(new Group({
      name: Background_Group_Key,
      style: { zIndex: Background_Group_ZIndex }
    }))

    this.panelGroup = sheetCanvas.appendChild(new Group({
      name: Panel_Group_Key,
      style: { zIndex: Panel_Group_ZIndex }
    }))

    this.foregroundGroup = sheetCanvas.appendChild(new Group({
      name: Foreground_Group_Key,
      style: { zIndex: Foreground_Group_ZIndex }
    }))
  }

  destroy() { }
}
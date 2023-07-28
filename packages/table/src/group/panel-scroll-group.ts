import { Group, GroupStyleProps, DisplayObjectConfig } from "@antv/g";
import { GridGroup, GridInfo } from "./grid-group";
import { Sheet } from "../sheet";
import { Panel_Scroll_Group_Id } from "../common/constant";
import { updateMergedCell, MergedCell } from '../cell'

export type PanelScrollGroupConfig = DisplayObjectConfig<GroupStyleProps> & {
  sheet: Sheet
}


export class PanelScrollGroup extends GridGroup {
  mergedCellsGroup: Group;

  constructor(config: PanelScrollGroupConfig) {
    super(config);

    this.initMergeCellsGroup();
  }

  initMergeCellsGroup() {
    if (this.mergedCellsGroup && this.getElementById(Panel_Scroll_Group_Id)) return;

    this.mergedCellsGroup = this.appendChild(new Group({ id: Panel_Scroll_Group_Id }));
  }

  updateMergeCellsGroup() {
    this.initMergeCellsGroup();
    updateMergedCell(this.sheet, this.mergedCellsGroup);
    this.mergedCellsGroup.toFront();
  }

  addMergeCell(mergedCell: MergedCell) {
    this.mergedCellsGroup?.appendChild(mergedCell);
    // TODO:
  }

  update(gridInfo: GridInfo) {
    this.updateGrid(gridInfo);
    this.updateMergeCellsGroup()
  }
}
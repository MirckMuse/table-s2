import { LayoutInfo } from "../common/interface/facet";
import { Facet } from "./facet";

export class TableFacet extends Facet {

  protected calcLayoutInfo(): LayoutInfo {
    return {
      colLeafNodes: [],
      colNodes: [],
      seriesNumberNodes: []
    }
  }
}
import { Sheet } from "../../sheet";
import { BBox, LayoutInfo } from "../../common/interface";
import { Facet } from "../facet";

export abstract class BaseBBox implements BBox {
  x = 0;
  y = 0;
  maxX = 0;
  maxY = 0;
  minX = 0;
  minY = 0;
  width = 0;
  height = 0;

  // 原始宽高
  originWidth = 0;
  originHeight = 0;

  // 可视宽高
  viewportWidth = 0;
  viewportHeight = 0;

  protected facet: Facet;

  protected sheet: Sheet;

  protected layoutInfo: LayoutInfo;

  constructor(facet: Facet, immediateCalcuate = false) {
    this.facet = facet;
    this.sheet = facet.sheet
    this.layoutInfo = facet.layoutInfo

    if (immediateCalcuate) {
      this.calcuateBBox()
    }
  }

  protected abstract calcuateBBox(): void;
}
import { Group, Rect } from '@antv/g';
import { BaseHeaderMeta, ScrollOffset } from '../common/interface';
import { Sheet } from '../sheet';

export abstract class BaseHeader<Meta extends BaseHeaderMeta> extends Group {
  protected meta: Meta;
  protected sheet: Sheet;
  getMeta() {
    return this.meta;
  }

  protected type = 'BaseHeader';

  constructor(sheet: Sheet, meta: Meta) {
    super({
      style: {
        ...meta.position,
        width: meta.width,
        height: meta.height,
      }
    });

    this.sheet = sheet;
    this.meta = meta;
    this.init();
  }

  // 清理尺寸调整的图形
  protected clearResizeGroup() {
    const foregroundGroup = this.sheet.facet.foregroundGroup;
    const resizeGroup = foregroundGroup?.getElementById<Group>(this.type);
    resizeGroup?.removeChildren();
  }

  render() {
    this.clearResizeGroup();
    this.clear();
    this.layout();
    this.offset();
    this.clip();
  }

  renderByScrollOffset(scrollOffset: ScrollOffset) {
    this.meta.scrollX = scrollOffset.scrollX;
    this.meta.scrollY = scrollOffset.scrollY;

    this.render();
  }

  clear() {
    super.removeChildren();
  }

  // 空方法，方便子类继承时使用。
  protected init() { }

  /** ============== 抽象方法 ================= */

  protected abstract layout(): void;

  protected abstract offset(): void;

  protected abstract clip(): void;

  protected isInViewport() {
    // TODO: S2 isHeaderCellInViewport
  }
}

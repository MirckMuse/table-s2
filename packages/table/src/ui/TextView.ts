import { DisplayObjectConfig, Text, TextStyleProps } from '@antv/g';

// 自定义的文字类，后续需要新增以下功能:
//  1. 文字选中。
//  2. 文字复制。
export class TextView<T = any> extends Text {

  // 暂时不知道 appendInfo 有什么用。
  appendInfo: T;

  constructor(options: DisplayObjectConfig<TextStyleProps>, appendInfo?: T) {
    super(options);

    if (appendInfo) {
      this.appendInfo = appendInfo
    }

    this.init();
  }

  protected init() {
    this.initDblClickEvent();
  }

  protected initDblClickEvent() {
    // TODO:
  }
}
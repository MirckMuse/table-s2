import { DisplayObject, DisplayObjectConfig, FederatedPointerEvent, Text, TextStyleProps } from '@antv/g';
import { renderRect, renderText } from '../shared';
import { OriginEventType, Position } from '../common/interface';

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

  protected initStyle() {
    Object.assign(this.style, { cursor: 'text' })
  }

  protected init() {
    this.initStyle();
    this.initDblClickEvent();
    this.initBrushEvent();
  }

  selectionShapes: DisplayObject[] = [];
  clearBrushShape() {
    this.selectionShapes.forEach(shape => shape.remove());
    this.selectionShapes = [];
  }

  setBrushText(start: Position, end: Position) {
    this.clearBrushShape();
  }

  protected initBrushEvent() {
    const startPosition = { x: 0, y: 0 }
    const endPosition = { x: 0, y: 0 }
    let isBrush = false
    this.addEventListener(OriginEventType.POINTER_DOWN, (event: FederatedPointerEvent) => {
      this.clearBrushShape();
      startPosition.x = event.x
      startPosition.y = event.y
      isBrush = true
    });
    this.addEventListener(OriginEventType.POINTER_MOVE, (event: FederatedPointerEvent) => {
      if (!isBrush) return;
      endPosition.x = event.x
      endPosition.y = event.y
      this.setBrushText(startPosition, endPosition)
    });
    this.addEventListener(OriginEventType.POINTER_UP, (event: FederatedPointerEvent) => {
      isBrush = false;
      endPosition.x = event.x
      endPosition.y = event.y
      this.setBrushText(startPosition, endPosition)
    })
  }

  // 双击全选
  protected initDblClickEvent() {
    // FIXME: antv/g 5.0 不支持双击。
    // this.addEventListener('click', () => {
    //   this.selectionShapes.forEach(shape => shape.remove());
    //   this.getLineBoundingRects().forEach(({ x, y, width, height }) => {
    //     this.selectionShapes.push(renderRect(this, { x, y, width, height, fill: 'red', zIndex: 0 }));
    //     this.selectionShapes.push(renderText(this, { ...this.style, text: this.textContent, fill: "#fff", zIndex: 1 }));
    //   });
    // });
  }
}
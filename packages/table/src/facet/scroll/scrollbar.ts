import type { DisplayObject, FederatedPointerEvent, LineStyleProps } from '@antv/g';
import { CustomEvent, Group, Line } from '@antv/g';
import { clamp } from 'lodash-es';
import { OriginEventType, Position, ScrollbarTheme } from "../../common/interface";

export enum ScrollType {
  ScrollChange = 'scroll-change',
  ScrollEnd = 'scroll-end',
}

export interface ScrollbarConfig {
  position: Position;

  trackLength: number;

  thumbOffset?: number;

  thumbLength: number;

  scrollMaxOffset: number;

  theme: ScrollbarTheme;
}

export abstract class Scrollbar extends Group implements ScrollbarConfig {
  thumbOffset: number;

  thumbLength: number;

  position: Position;

  trackLength: number;

  scrollMaxOffset: number;

  theme: ScrollbarTheme;

  scrollbarGroup: Group;

  trackShape: DisplayObject;

  thumbShape: DisplayObject;

  constructor(config: ScrollbarConfig) {
    super();

    Object.assign(this, config);
    this.thumbOffset = this.thumbOffset || 0
    this.initScrollbar()
  }

  private scrollFrameId: ReturnType<typeof requestAnimationFrame> | null = null;

  emitScrollChange(offset: number, updateThumbOffset = true) {
    this.scrollFrameId && cancelAnimationFrame(this.scrollFrameId);

    this.scrollFrameId = requestAnimationFrame(() => {
      const event = new CustomEvent(ScrollType.ScrollChange, {
        detail: { offset, updateThumbOffset }
      });

      this.dispatchEvent(event)
    });
  }

  protected initScrollbar() {
    this.createScrollbarGroup();
    this.createTrack();
    this.createThumb();
    this.updateScrollbarPosition(this.position.x, this.position.y);
    this.initEvents();
    this.bindEvents()
  }

  protected initEvents() {
    this.initScrollbarPointerDownEvent();
    this.initTrackClickEvent()
  }

  protected bindEvents() {
    this.addEventListener(OriginEventType.POINTER_DOWN, this.onScrollbarPointerDown)
    this.addEventListener(OriginEventType.POINTER_UP, this.onScrollbarPointerUp)

    this.trackShape.addEventListener(OriginEventType.CLICK, this.onTrackClick)

    this.thumbShape.addEventListener(OriginEventType.POINTER_OVER, this.onTrackPointerOver)
    this.thumbShape.addEventListener(OriginEventType.POINTER_OUT, this.onTrackPointerOut)
  }

  protected unbindEvents: () => void;

  bindEventListener(
    target: EventTarget,
    eventType: keyof HTMLElementEventMap,
    callback: EventListenerOrEventListenerObject
  ) {
    target?.addEventListener(eventType, callback, false)

    return {
      remove: () => {
        target?.removeEventListener(eventType, callback, false)
      }
    }
  }

  protected onTrackClick: (event: MouseEvent) => void;

  protected onTrackPointerOver = () => {
    const { hoverSize, hoverThumbColor } = this.theme

    this.thumbShape.attr('stroke', hoverThumbColor);
    this.thumbShape.attr('lineWidth', hoverSize)
  }

  protected onTrackPointerOut = () => {
    const { size, thumbColor } = this.theme

    this.thumbShape.attr('stroke', thumbColor);
    this.thumbShape.attr('lineWidth', size)
  }

  startPosition = 0;
  protected onScrollbarPointerDown: (event: FederatedPointerEvent) => void;

  protected abstract initScrollbarPointerDownEvent(): void;
  protected abstract initTrackClickEvent(): void;

  protected bindLaterEvent() {
    const canvas = this.ownerDocument?.defaultView;
    if (!canvas) return

    const containerDOM = document.body;

    const events = [
      this.bindEventListener(containerDOM, OriginEventType.POINTER_MOVE, this.onPointerMove),
      this.bindEventListener(containerDOM, OriginEventType.POINTER_UP, this.onPointerUp),
      this.bindEventListener(containerDOM, OriginEventType.POINTER_LEAVE, this.onPointerUp),
      this.bindEventListener(canvas as any as EventTarget, OriginEventType.POINTER_UP, this.onPointerUp)
    ]

    this.unbindEvents = () => events.forEach(event => event.remove())
  }

  protected abstract onPointerMove: (event: Event) => void;

  protected onPointerUp = (event: Event) => {
    event.preventDefault();
    this.dispatchEvent(new CustomEvent(ScrollType.ScrollEnd, {}) as any);

    this.unbindEvents?.();
  };

  protected onScrollbarPointerUp = this.onPointerUp;

  protected updateScrollbarPosition(x: number, y: number) {
    this.scrollbarGroup.setPosition(x, y)
  }

  protected createScrollbarGroup() {
    this.scrollbarGroup = this.appendChild(new Group({ class: ' scrollbar' }))
  }

  protected abstract createTrack(): void;
  protected abstract createThumb(): void;

  // 获取坐标系
  protected getCoordinate() {
    const { lineCap = 'butt' } = this.theme

    if (lineCap === 'butt') {
      return {
        strat: this.thumbOffset,
        end: this.thumbOffset + this.thumbLength
      }
    }

    const padding = this.padding

    return {
      start: this.thumbOffset + padding.start,
      end: this.thumbOffset + this.thumbLength - padding.end,
    };
  }

  protected abstract get coordinateName(): { from: string, to: string };

  protected abstract get padding(): { start: number, end: number };

  protected get trackStyle(): Omit<LineStyleProps, 'x1' | 'x2' | 'y1' | 'y2'> {
    const { lineCap = 'square', size, trackColor } = this.theme

    return {
      lineWidth: size,
      stroke: trackColor,
      lineCap,
    }
  }

  protected get thumbStyle(): Omit<LineStyleProps, 'x1' | 'x2' | 'y1' | 'y2'> {
    const { lineCap = 'square', size, thumbColor } = this.theme

    return {
      lineWidth: size,
      stroke: thumbColor,
      lineCap,
      cursor: 'default',
    };
  }

  updateThumbOffset(offset: number, emitScrollChange = true) {
    const validOffset = this.getValidOffset(offset);
    const isUnchanged = this.thumbOffset === validOffset && validOffset
    if (isUnchanged) return;


    this.thumbOffset = validOffset;

    const { from, to } = this.coordinateName;
    const { start, end } = this.getCoordinate();

    this.thumbShape.attr({
      [from]: start,
      [to]: end
    })

    if (emitScrollChange) {
      this.emitScrollChange(
        (validOffset / (this.trackLength - this.thumbLength)) * this.scrollMaxOffset,
        false
      )
    }
  }

  protected updateThumbLength(thumbLength: number) {
    if (this.thumbLength === thumbLength) return;

    this.thumbLength = thumbLength;
    const coordinate = this.coordinateName;
    this.thumbShape.attr(coordinate.to, this.thumbOffset + thumbLength);
    this.emitScrollChange(
      (this.thumbOffset / (this.trackLength - this.thumbLength)) * this.scrollMaxOffset,
      false
    )
  }

  getValidOffset(offset: number) {
    return clamp(offset, 0, this.trackLength - this.thumbLength)
  }
}

export class HorizontalScrollbar extends Scrollbar {
  protected initTrackClickEvent() {
    this.onTrackClick = (event: MouseEvent) => {

      const offset = event.x - this.position.x - this.thumbLength / 2;

      const validOffset = this.getValidOffset(offset);

      this.updateThumbOffset(validOffset)
    };
  }

  protected initScrollbarPointerDownEvent() {
    this.onScrollbarPointerDown = (event: FederatedPointerEvent) => {
      event.preventDefault();
      const { clientX } = event;

      // 将开始的点记录下来
      this.startPosition = clientX;

      this.bindLaterEvent();
    };
  }

  protected onPointerMove = (event: Event) => {
    event.preventDefault()

    const { clientX } = event as PointerEvent;
    this.updateThumbOffset(this.thumbOffset + clientX - this.startPosition)
    this.startPosition = clientX
  };


  protected get padding() {
    return { start: 0, end: this.theme.size ?? 0 }
  }

  protected get coordinateName() {
    return { from: 'x1', to: 'x2' }
  }

  protected createScrollbarGroup(): void {
    this.scrollbarGroup = this.appendChild(new Group({ class: 'horizontalBar' }))
  }

  protected createThumb(): void {
    const style = this.thumbStyle

    const { size = 0 } = this.theme

    const { start = 0, end = 0 } = this.getCoordinate()
    console.log(this.getCoordinate())

    this.thumbShape = this.scrollbarGroup.appendChild(new Line({
      style: {
        ...style,
        x1: start,
        y1: size / 2,
        x2: end,
        y2: size / 2,
      }
    }))
  }

  protected createTrack(): void {
    const style = this.trackStyle

    const { size = 0 } = this.theme

    this.trackShape = this.scrollbarGroup.appendChild(new Line({
      style: {
        ...style,
        x1: 0,
        y1: size / 2,
        x2: this.trackLength,
        y2: size / 2,
      }
    }))
  }
}

export class VerticalScrollbar extends Scrollbar {
  protected initTrackClickEvent() {
    this.onTrackClick = (event: MouseEvent) => {

      const offset = event.y - this.position.y - this.thumbLength / 2;

      const validOffset = this.getValidOffset(offset);

      this.updateThumbOffset(validOffset)
    };
  }

  protected initScrollbarPointerDownEvent() {
    this.onScrollbarPointerDown = (event: FederatedPointerEvent) => {
      event.preventDefault();
      const { clientY } = event;

      // 将开始的点记录下来
      this.startPosition = clientY;

      this.bindLaterEvent();
    };
  }

  protected onPointerMove = (event: Event) => {
    event.preventDefault()

    const { clientY } = event as PointerEvent;
    this.updateThumbOffset(this.thumbOffset + clientY - this.startPosition)
    this.startPosition = clientY
  };

  protected get coordinateName() {
    return { from: 'y1', to: 'y2' }
  }

  protected get padding() {
    const size = this.theme.size ?? 0
    return { start: size / 2, end: size / 2 }
  }

  protected createScrollbarGroup(): void {
    this.scrollbarGroup = this.appendChild(new Group({ class: 'verticalBar' }))
  }

  protected createThumb(): void {
    const style = this.thumbStyle

    const { size = 0 } = this.theme

    const { start = 0, end = 0 } = this.getCoordinate()

    this.thumbShape = this.scrollbarGroup.appendChild(new Line({
      style: {
        ...style,
        x1: size / 2,
        y1: start,
        x2: size / 2,
        y2: end,
      }
    }))
  }

  protected createTrack(): void {
    const style = this.trackStyle

    const { size = 0 } = this.theme

    this.trackShape = this.scrollbarGroup.appendChild(new Line({
      style: {
        ...style,
        x1: size / 2,
        y1: 0,
        x2: size / 2,
        y2: this.trackLength,
      }
    }))
  }
}
import { clamp, debounce, get, isUndefined } from 'lodash-es';
import { ScrollOffset, ScrollSpeedRatio, ScrollbarPositionType, WheelOffset } from "../../common/interface";
import { isMobile } from '../../shared';
import { BaseEvent } from "../../event/base";
import { HorizontalScrollbar, ScrollType, Scrollbar, VerticalScrollbar } from './scrollbar';

export class ScrollEvent extends BaseEvent {

  horizontalScrollbar: Scrollbar;

  verticalScrollbar: Scrollbar;

  public bindEvents(): void {
    this.renderScrollbars();
    this.bindPCScroll()
  }

  renderScrollbars() {
    const { scrollX, scrollY } = this.getScrollOffset()
    const facet = this.sheet.facet

    const { width: panelWidth, height: panelHeight } = facet.panelBBox
    const realWidth = facet.getRealWidth()
    const realHeight = facet.getRealHeight()

    this.renderHorizontalScrollbar(panelWidth, realWidth, scrollX)
    this.renderVerticalScrollbar(panelHeight, realHeight, scrollY)
  }

  renderHorizontalScrollbar(panelWidth: number, realWidth: number, scrollX: number) {
    if (Math.floor(panelWidth) > Math.floor(realWidth)) return

    const panelBBox = this.sheet.facet.panelBBox

    const halfScrollbarSize = this.getScrollbarSize() / 2

    const { y: scrollbarY } = this.getScrollbarPosition();

    const finalWidth = panelWidth

    const finalPosition = { x: panelBBox.minX + halfScrollbarSize, y: scrollbarY }

    const finalRealWidth = realWidth

    const maxOffset = finalRealWidth - finalWidth

    const { scrollbar: scrollbarTheme } = this.sheet.theme;

    const thumbLength = Math.max(
      (finalWidth / finalRealWidth) * finalWidth,
      scrollbarTheme.thumbMinLength
    )

    const scrollbar = new HorizontalScrollbar({
      scrollMaxOffset: maxOffset,
      theme: this.sheet.theme.scrollbar,
      thumbLength: thumbLength,
      trackLength: finalWidth,
      position: finalPosition,
      thumbOffset: (scrollX * (finalWidth - thumbLength)) / maxOffset
    })

    scrollbar.addEventListener(ScrollType.ScrollChange, (event: CustomEvent) => {
      const { offset, updateThumbOffset } = event.detail as any

      const scrollX = clamp(offset, 0, maxOffset)

      if (updateThumbOffset) {
        this.horizontalScrollbar.updateThumbOffset(
          this.getScrollbarOffset(scrollX, this.horizontalScrollbar),
          false
        )
      }

      this.setScrollOffset({ scrollX })
      this.sheet.facet.dynamicRenderCell();
    })

    this.horizontalScrollbar = scrollbar;
    this.sheet.facet.foregroundGroup.appendChild(this.horizontalScrollbar)
  }

  renderVerticalScrollbar(panelHeight: number, realHeight: number, scrollY: number) {
    if (panelHeight >= realHeight) return

    const { scrollbar: scrollbarTheme } = this.sheet.theme

    const thumbLength = Math.max((panelHeight / realHeight) * panelHeight, scrollbarTheme.thumbMinLength);

    const thumbMaxOffset = realHeight - panelHeight

    const { x: scrollbarX } = this.getScrollbarPosition()

    const { minY } = this.sheet.facet.panelBBox

    const scrollbar = new VerticalScrollbar({
      trackLength: panelHeight,
      thumbLength,
      thumbOffset: (scrollY * (panelHeight - thumbLength)) / thumbMaxOffset,
      position: {
        x: scrollbarX,
        y: minY
      },
      theme: scrollbarTheme,
      scrollMaxOffset: thumbMaxOffset
    })

    scrollbar.addEventListener(ScrollType.ScrollChange, (event: CustomEvent) => {
      const { offset, updateThumbOffset } = event.detail as any

      const scrollY = clamp(offset, 0, thumbMaxOffset)

      if (updateThumbOffset) {
        this.verticalScrollbar.updateThumbOffset(this.getScrollbarOffset(scrollY, this.verticalScrollbar), false)
      }

      this.setScrollOffset({ scrollY })
      this.sheet.facet.dynamicRenderCell()
    })

    this.verticalScrollbar = scrollbar
    this.sheet.facet.foregroundGroup.appendChild(this.verticalScrollbar)
  }

  protected bindPCScroll() {
    const canvas = this.sheet.getCanvasElement()
    canvas?.addEventListener('wheel', this.onWheel)
  }

  public unbindEvents(): void {
    const canvas = this.sheet.getCanvasElement()
    canvas?.removeEventListener('wheel', this.onWheel)
    this.scrollFrameId && cancelAnimationFrame(this.scrollFrameId)
  }

  cancelScrollFrame() {
    if (isMobile() && this.scrollFrameId) {
      return false
    }

    this.scrollFrameId && cancelAnimationFrame(this.scrollFrameId)
    return true
  }

  delayHideScrollbarOnMobile() {
    if (!isMobile()) return

    this.delayHideScrollbar()
  }

  delayHideScrollbar = debounce(this.hideScrollbar, 1000);

  hideScrollbar() {
    // TODO: 考虑怎么缓缓变淡
    this.horizontalScrollbar?.setAttribute('visibility', 'visible')
    this.verticalScrollbar?.setAttribute('visibility', 'visible')
  }

  clearScrollFrameIdOnMobile() {
    if (!isMobile()) return

    this.scrollFrameId && cancelAnimationFrame(this.scrollFrameId)
    this.scrollFrameId = null
  }

  onWheel = (event: WheelEvent) => {
    let { deltaX, deltaY, offsetX, offsetY } = event

    // 按住 shift 时，为水平滚动，忽略水平方向的滚动值。
    // 只用垂直方向的偏差值计算
    const { shiftKey } = event
    if (shiftKey) {
      offsetX = offsetX - deltaX + deltaY;
      deltaX = deltaY;
      offsetY -= deltaY;
      deltaY = 0;
    }
    const { interaction } = this.sheet.getConfig()


    const [optimizedDeltaX, optimizedDeltaY] = this.optimizeScrollXY(
      deltaX,
      deltaY,
      interaction?.scrollSpeedRatio ?? 1
    );

    // S2 这里会隐藏 tooltip，并清理 hover 的 timer。

    if (!this.isScrollOverViewport({
      deltaX: optimizedDeltaX,
      deltaY: optimizedDeltaY,
      offsetX,
      offsetY
    })) {
      if (interaction?.overscrollBehavior !== 'auto') {
        this.stopScroll(event)
      }
      return
    }

    this.stopScroll(event)

    // TODO: S2 这边添加了 hover 的拦截器


    if (!this.cancelScrollFrame()) {
      return;
    }

    // TODO: 可以考虑加锁
    this.scrollFrameId = requestAnimationFrame(() => {
      const { scrollX, scrollY } = this.getScrollOffset()

      if (optimizedDeltaX !== 0) {
        this.visibleHorizontalScrollbar()
        this.updateHorizontalScrollbarOffset({ offsetX, offsetY, offset: optimizedDeltaX + scrollX })
      }

      if (optimizedDeltaY !== 0) {
        this.visibleVerticalScrollbar()
        this.updateVerticalScrollbarOffset(optimizedDeltaY + scrollY)
      }

      this.delayHideScrollbarOnMobile();
      this.clearScrollFrameIdOnMobile();
    })
  }

  getScrollOffset(): Required<ScrollOffset> {
    const { store } = this.sheet

    return {
      scrollX: store.get<keyof ScrollOffset>('scrollX', 0),
      scrollY: store.get<keyof ScrollOffset>('scrollY', 0),
    }
  }

  getScrollbarPosition() {
    const isContentMode = this.sheet.config.interaction?.scrollbarPosition === ScrollbarPositionType.CONTENT

    const scrollbarSize = this.getScrollbarSize()

    if (isContentMode) {
      const { maxX, maxY } = this.sheet.facet.panelBBox
      return {
        x: maxX - scrollbarSize,
        y: maxY - scrollbarSize
      }
    }

    const { width = 0, height = 0 } = this.sheet
    return {
      x: width - scrollbarSize,
      y: height - scrollbarSize
    }
  }

  getScrollbarSize() {
    return this.sheet.theme.scrollbar.size
  }

  getScrollbarOffset(offset: number, scrollbar: Scrollbar) {
    const { trackLength, thumbLength, scrollMaxOffset } = scrollbar;

    return (offset * (trackLength - thumbLength)) / scrollMaxOffset;
  }

  setScrollOffset(scrollOffset: ScrollOffset) {
    Object.keys(scrollOffset).forEach((key) => {
      const offset = get(scrollOffset, key);

      if (!isUndefined(offset)) {
        this.sheet.store.set(key, Math.floor(offset));
      }
    });
  }

  scrollFrameId: ReturnType<typeof requestAnimationFrame> | null = null;

  stopScroll(event: WheelEvent) {
    event?.preventDefault?.();
    (event as any)?.originalEvent?.preventDefault?.();
  }

  protected optimizeScrollXY(x: number, y: number, ratio: number | ScrollSpeedRatio): [number, number] {
    const ANGLE = 2;
    const angle = Math.abs(x / y);

    // 经过滚动优化之后的 x, y
    const deltaX = angle <= 1 / ANGLE ? 0 : x;
    const deltaY = angle > ANGLE ? 0 : y;

    // TODO: 怎么样以曲线的方式来滚动呢？？

    const ratioLocal: ScrollSpeedRatio = typeof ratio === 'number'
      ? { horizontal: ratio, vertical: ratio }
      : ratio

    // rome-ignore lint/style/noNonNullAssertion: <explanation>
    return [deltaX * ratioLocal.horizontal!, deltaY * ratioLocal.vertical!];
  }

  // 判断是否滚动超过可视区域
  isScrollOverViewport(wheelOffset: WheelOffset): boolean {
    const { deltaY, deltaX } = wheelOffset;

    if (deltaY) {
      return this.isScrollOverViewportVertical(deltaY)
    }

    if (deltaX !== 0) {
      return this.isScrollOverViewportHorizontal(wheelOffset)
    }

    return false
  }

  isScrollOverViewportVertical(deltaY: number) {
    return !this.isScrollToTop(deltaY) && !this.isScrollToBottom(deltaY)
  }

  isScrollToTop(deltaY: number) {
    if (!this.verticalScrollbar) return true

    return deltaY <= 0 && this.verticalScrollbar.thumbOffset <= 0;
  }

  isScrollToBottom(deltaY: number) {
    if (!this.verticalScrollbar) return true

    const { thumbOffset, thumbLength } = this.verticalScrollbar

    const { height: panelHeight } = this.sheet.facet.panelBBox

    return deltaY >= 0 && thumbOffset + thumbLength >= panelHeight
  }

  isScrollOverViewportHorizontal(wheelOffset: WheelOffset) {
    return !this.isScrollToLeft(wheelOffset) && !this.isScrollToRight(wheelOffset)
  }

  isScrollToLeft(wheelOffset: WheelOffset) {
    if (!this.horizontalScrollbar) return true

    const { deltaX } = wheelOffset

    return Number(deltaX) <= 0 && this.horizontalScrollbar.thumbOffset <= 0
  }

  isScrollToRight(wheelOffset: WheelOffset) {
    if (!this.horizontalScrollbar) return true

    const { thumbLength, thumbOffset } = this.horizontalScrollbar

    const { deltaX } = wheelOffset

    const { width: panelWidth } = this.sheet.facet.panelBBox

    return Number(deltaX) >= 0 && thumbOffset + thumbLength >= panelWidth
  }

  isScrollInPanel(wheelOffset: WheelOffset) {
    const { offsetX, offsetY } = wheelOffset

    const { minX, minY, maxX, maxY } = this.sheet.facet.panelBBox

    return offsetX > minX && offsetX < maxX && offsetY > minY && offsetY < maxY
  }

  // 更新滚动条的位置

  visibleHorizontalScrollbar() {
    this.horizontalScrollbar?.setAttribute('visibility', 'visible')
  }

  updateHorizontalScrollbarOffset(whellOffset: WheelOffset) {
    if (!this.isScrollInPanel(whellOffset)) return

    this.horizontalScrollbar?.emitScrollChange(whellOffset.offset ?? 0)
  }

  updateVerticalScrollbarOffset(offset: number) {
    this.verticalScrollbar?.emitScrollChange(offset)
  }

  visibleVerticalScrollbar() {
    this.verticalScrollbar?.setAttribute('visibility', 'visible')
  }

  adjustScrollOffset() {
    this.setScrollOffset(this.getAdjustedScrollOffset(this.getScrollOffset()))
  }
  getAdjustedScrollOffset({ scrollX, scrollY }: ScrollOffset): ScrollOffset {
    function getAdjustedScrollOffset(scroll: number, content: number, container: number) {
      return Math.max(0, Math.min(content - container, scroll))
    }

    const { width, height } = this.sheet.facet.panelBBox

    const rendererWidth = 0;
    const rendererHeight = 0;

    return {
      scrollX: getAdjustedScrollOffset(scrollX ?? 0, rendererWidth, width),
      scrollY: getAdjustedScrollOffset(scrollY ?? 0, rendererHeight, height),
    }
  }
}
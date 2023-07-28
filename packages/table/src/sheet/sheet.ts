import type { DataSet } from '../data-set';
import type { Facet } from '../facet';

import EventEmitter from '@antv/event-emitter'
import { Config, DataConfig, MountElement } from '../common/interface';
import { Canvas } from '@antv/g'
import { Renderer } from '@antv/g-canvas';
import { MIN_DEVICE_PIXEL_RATIO, TableEvent, Default_Config } from '../common/constant';
import { Interaction } from '../interaction';
import { Store } from '../store'
import { Adaptive, BaseTheme, HdAdapter } from '../ui';
import { memoize, merge } from 'lodash-es'

export type MeasureText = string | number;

/**
 * 基础的表格
 */
export abstract class Sheet extends EventEmitter {
  get width() {
    return this.canvas.getConfig().width
  }

  get height() {
    return this.canvas.getConfig().height
  }

  protected dataConfig: DataConfig;

  getDataConfig() {
    return this.dataConfig
  }

  config: Config;

  getConfig() {
    return this.config
  }
  updateConfig(config: Partial<Config>, reset?: boolean) {
    if (reset) {
      this.config = merge(Default_Config, config)
    } else {
      this.config = merge(this.config, config)
    }
  }

  protected dataSet: DataSet;

  store = new Store();

  public abstract getDataSet(): DataSet;

  constructor(
    dom: MountElement,
    dataConfig: DataConfig,
    config: Config
  ) {
    super();
    this.dataConfig = dataConfig;
    this.config = config;
    this.dataSet = this.getDataSet()
    this.init(dom);

  }

  // 初始化
  protected init(dom: MountElement) {
    this.initCanvas(dom);
    this.bindEvents()
    this.initAdaptive()
    this.initInteraction()
    this.initTheme()
    this.initHdAdapter()
  }

  protected canvas: Canvas;
  getCanvas() {
    return this.canvas
  }
  protected initCanvas(dom: MountElement) {
    // TODO: 需要是否为自适应
    const { width, height } = dom.getBoundingClientRect()

    const { supportsCSSTransform } = this.config

    this.canvas = new Canvas({
      container: dom,
      width: width,
      height: height,
      devicePixelRatio: Math.max(window.devicePixelRatio, MIN_DEVICE_PIXEL_RATIO),
      renderer: new Renderer(),
      supportsCSSTransform
    })

    this.transformCanvas2Block()
  }

  /**
   * 获取 canvas 元素
   * @returns HTMLCanvasElement
   */
  getCanvasElement() {
    return this.canvas.getContextService().getDomElement() as HTMLCanvasElement
  }

  /**
   *  将 canvas 元素转换成 block 元素。不然会有高度差。
   */
  protected transformCanvas2Block() {
    const canvasElement = this.getCanvasElement()

    if (canvasElement) {
      canvasElement.style.display = 'block'
    }
  }

  // 初始化交互
  interaction: Interaction;
  protected initInteraction() {
    const { override } = this.config.interaction ?? {}

    this.interaction = override ? override(this) : new Interaction(this)
  }

  theme: BaseTheme;

  // 初始化主题
  protected initTheme() {
    this.theme = new BaseTheme(this)
  }

  // 初始化高清适配器
  hdAdapter: HdAdapter;
  protected initHdAdapter() {
    const { hdAdapter } = this.config

    if (!hdAdapter) return

    this.hdAdapter = typeof hdAdapter === 'object' && hdAdapter.override
      ? hdAdapter.override(this)
      : new HdAdapter(this)
  }

  // 初始化尺寸自适应
  adaptive: Adaptive;
  protected initAdaptive() {
    const { adaptive } = this.config

    if (!adaptive) return

    this.adaptive = typeof adaptive === 'object' && adaptive.override
      ? adaptive.override(this)
      : new Adaptive(this)
  }

  private destroyed = false;

  // 渲染表格
  async render() {
    if (this.destroyed) return

    await this.canvas.ready

    if (!this.getCanvasElement()) return

    this.emit(TableEvent.LAYOUT_BEFORE_RENDER);

    // TODO:

    this.initFacet()

    // TODO:

    this.emit(TableEvent.LAYOUT_AFTER_RENDER)
  }

  destroy() {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    this.store.clear()
    this.facet?.destroy();
    this.hdAdapter?.destroy();
    this.adaptive?.destroy();
    this.interaction?.destroy()
    this.unbindEvents()
    this.canvas?.destroy()
    this.emit(TableEvent.LAYOUT_DESTROY)
  }

  protected abstract bindEvents(): void;

  protected unbindEvents() {
    Object.keys(this.getEvents()).forEach(evt => this.off(evt))
  }

  facet: Facet;
  protected abstract initFacet(): void;

  // ========= 测量方法 ============
  measureText = memoize(
    (text: MeasureText, font: CSSStyleDeclaration): TextMetrics | null => {
      const ctx = this.getCanvasElement()?.getContext('2d');

      if (!ctx) return null

      const { fontSize, fontFamily, fontWeight, fontStyle, fontVariant } = font;

      ctx.font = [
        fontStyle,
        fontVariant,
        fontWeight,
        `${fontSize}px`,
        fontFamily
      ].join(' ').trim();

      return ctx.measureText(text.toString());
    },
    (text: MeasureText, font: CSSStyleDeclaration) => [text, ...Object.values(font)].join('')
  );

  measureTextWidth(text: MeasureText, font: CSSStyleDeclaration): number {
    return this.measureText(text, font)?.width ?? 0
  }

  measureTextHeight(text: MeasureText, font: CSSStyleDeclaration): number {
    const textMetrics = this.measureText(text, font);
    if (!textMetrics) return 0;

    return textMetrics.actualBoundingBoxDescent + textMetrics.actualBoundingBoxAscent;
  }

  measureTextWithRoughly(text: MeasureText, font: CSSStyleDeclaration): number {
    if (!text) return 0;

    const chineseTextWidth = this.measureTextWidth('中', font);
    const englishTextWidth = this.measureTextWidth('W', font);

    return Array.from(text.toString()).reduce((width, char) => {
      const charCode = char.charCodeAt(0);

      const isUseEnglishWidht = charCode >= 0 && charCode <= 255

      return width + (isUseEnglishWidht ? englishTextWidth : chineseTextWidth)
    }, 0)
  }


}
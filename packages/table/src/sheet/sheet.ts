import type { DataSet } from '../data-set';
import type { Facet } from '../facet';

import EventEmitter from '@antv/event-emitter'
import { Config, DataConfig, MountElement } from '../common/interface';
import { Canvas } from '@antv/g'
import { Renderer } from '@antv/g-canvas';
import { MIN_DEVICE_PIXEL_RATIO, TableEvent } from '../common/constant';
import { Interaction } from '../interaction';
import { Store } from '../store'
import { Adaptive, HdAdapter } from '../ui';

/**
 * 基础的表格
 */
export abstract class Sheet extends EventEmitter {

  protected dataConfig: DataConfig;

  public getDataConfig() {
    return this.dataConfig
  }

  protected config: Config;

  getConfig() {
    return this.config
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
    this.initCanvas(dom)
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

  // 初始化主题
  protected initTheme() {
    // TODO:
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

  // 渲染表格
  render() {
    if (!this.getCanvasElement()) return

    this.emit(TableEvent.LAYOUT_BEFORE_RENDER);

    // TODO:

    this.initFacet()
  }

  destroy() {
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
  protected abstract initFacet(): Facet;
}
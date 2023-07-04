import EventEmitter from '@antv/event-emitter'
import { Config, DataConfig, MountElement } from '../common/interface';

import type { DataSet } from '../data-set';

/**
 * 基础的表格
 */
export abstract class Sheet extends EventEmitter {

  dataConfig: DataConfig;

  config: Config;

  dataSet: DataSet;

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
  }


}
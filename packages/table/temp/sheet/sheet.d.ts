import EventEmitter from '@antv/event-emitter';
import { Config, DataConfig, MountElement } from '../common/interface';
import type { DataSet } from '../data-set';
/**
 * 基础的表格
 */
export declare abstract class Sheet extends EventEmitter {
    dataConfig: DataConfig;
    config: Config;
    dataSet: DataSet;
    abstract getDataSet(): DataSet;
    constructor(dom: MountElement, dataConfig: DataConfig, config: Config);
}

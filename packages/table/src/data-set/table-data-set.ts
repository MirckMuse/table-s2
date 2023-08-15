import { isFunction, isNumber } from 'lodash-es';
import { DataConfig, ViewMeta, RowData, FrontendSorterParam, Filter, SortOrder } from '../common/interface';
import { DataSet } from './data-set';

function isAllNumber(a: unknown, b: unknown) {
  return isNumber(a) && isNumber(b)
}

function isAllNotNumber(a: unknown, b: unknown) {
  return !isNumber(a) && !isNumber(b)
}

function sortString(a: string, b: string): number {
  if (a === b) return 0;

  const aList = [...a]
  const bList = [...b]

  for (const chartAIndex in aList) {
    const aChar = aList[chartAIndex];
    const bChar = bList[chartAIndex];


    if (!aChar) return -1;
    if (!bChar) return 1;
    if (aChar === bChar) continue;

    return aChar.charCodeAt(0) - bChar.charCodeAt(0);

  }

  return 0
}

function createSortCompareFunction(sorters: FrontendSorterParam[]) {
  // TODO: 生成多列排序的函数
  return function (a: RowData, b: RowData): number {
    for (const sorterParam of sorters) {
      const { sorter, order, defaultOrder } = sorterParam

      if (isFunction(sorter)) {
        const sorterResult = sorter(a, b);
        if (sorterResult === 0) {
          continue;
        }
      }

      let preValue = a[sorter as string];
      let currentValue = b[sorter as string]

      const realOrder = order || defaultOrder;
      if (!realOrder) continue;

      let sorterResult = 0;


      if (isAllNumber(preValue, currentValue)) {
        // 都是数字的排序方式
        preValue = preValue as number;
        currentValue = currentValue as number;

        sorterResult = (preValue as number) - (currentValue as number);
      } else if (isAllNotNumber(preValue, currentValue)) {
        // 都不为数字时，需要转换成字符串来比对
        preValue = preValue ? preValue.toString() : String(preValue || '')
        currentValue = currentValue ? currentValue.toString() : String(currentValue || '')

        sorterResult = sortString(preValue as string, currentValue as string)
      } else {
        if (isNumber(preValue)) {
          sorterResult = -1
        } else {
          sorterResult = 1
        }
      }

      if (sorterResult === 0) continue;
      return realOrder === SortOrder.Ascend ? sorterResult : -sorterResult;
    }

    return 0
  }
}

function createFilterPredicate(filters: Filter[]) {
  return function (rowData: RowData, index: number, originDatas: RowData[]) {
    return filters.every(filter => filter(rowData, index, originDatas))
  }
}

export class TableDataSet extends DataSet {
  processDataConfig(dataConfig: DataConfig): DataConfig {
    return dataConfig;
  }

  getRowData(viewMeta: ViewMeta): RowData {
    return this.displayData[viewMeta.rowIndex];
  }

  // 排序数据
  private processSort(rowDatas: RowData[]) {
    const compareFunction = createSortCompareFunction(this.frontendSorters || [])

    return rowDatas.sort(compareFunction)
  }

  // 筛选数据
  private processFilter(rowDatas: RowData[]) {
    const predicate = createFilterPredicate(this.filters || [])

    return rowDatas.filter(predicate)
  }

  // 处理数据
  processOriginData() {
    const filteredData = this.processFilter(this.originData);

    this.displayData = this.processSort(filteredData);
  }

  setDataConfig(dataConfig: DataConfig) {
    super.setDataConfig(dataConfig);

    this.processOriginData();
  }
}
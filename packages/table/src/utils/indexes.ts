import { DataIndex, Diff, DiffItem, Indexes, RowIndex, SimpleBBox, ViewCellHeights, ViewCellWidths } from "../common/interface";
import { isEmpty } from 'lodash-es';

// 根据索引生成 diff 项
export function allIndexes(indexes: Indexes): DiffItem[] {
  const [startRowIndex, endRowIndex, lastViewDataIndexs] = indexes;

  let result: DiffItem[] = [];

  for (let rowIndex = startRowIndex; rowIndex <= endRowIndex; rowIndex++) {
    result = result.concat(lastViewDataIndexs.map(dataIndex => ([rowIndex, dataIndex])))
  }

  return result;
}

// 根据行索引和 dataIndex 来判断单元格是否在可视范围内
export function isCellInRange(rowIndex: RowIndex, dataIndex: DataIndex, indexes: Indexes) {
  const [startRowIndex, endRowIndex, dataIndexs] = indexes;

  return dataIndexs.includes(dataIndex) && startRowIndex <= rowIndex && rowIndex <= endRowIndex;
}

// diff 索引
export function diffIndexes(sourceIndexes: Indexes, targetIndexes: Indexes): Diff {
  const isSourceEmpty = isEmpty(sourceIndexes);
  const isTargetEmpty = isEmpty(targetIndexes);

  if (isSourceEmpty && isTargetEmpty) {
    return { add: [], remove: [] };
  }

  if (isSourceEmpty && !isTargetEmpty) {
    return { add: allIndexes(targetIndexes), remove: [] }
  }

  if (!isSourceEmpty && isTargetEmpty) {
    return { add: [], remove: allIndexes(sourceIndexes) }
  }

  const [sourceStartRowIndex, sourceEndRowIndex, sourceDataIndexes] = sourceIndexes;
  const [targetStartRowIndex, targetEndRowIndex, targetDataIndexes] = targetIndexes;

  let remove: DiffItem[] = [];
  for (let sourceRowIndex = sourceStartRowIndex; sourceRowIndex <= sourceEndRowIndex; sourceRowIndex++) {
    remove = remove.concat(
      sourceDataIndexes
        .filter(dataIndex => isCellInRange(sourceRowIndex, dataIndex, targetIndexes))
        .map(dataIndex => ([sourceRowIndex, dataIndex]))
    )
  }

  let add: DiffItem[] = [];
  for (let targetRowIndex = targetStartRowIndex; targetRowIndex <= targetEndRowIndex; targetRowIndex++) {
    add = add.concat(
      targetDataIndexes
        .filter(dataIndex => isCellInRange(targetRowIndex, dataIndex, sourceIndexes))
        .map(dataIndex => ([targetRowIndex, dataIndex]))
    )
  }

  return { add, remove };
}

// 计算可视窗口的索引值
export function calcuateViewportIndexes(options: {
  scrollX: number,
  scrollY: number,
  viewCellWidths: ViewCellWidths,
  viewCellHeights: ViewCellHeights,
  viewport: SimpleBBox
}): Indexes {
  const { scrollX, scrollY, viewCellHeights, viewCellWidths, viewport } = options;

  const xMin = scrollX + viewport.x;
  const xMax = xMin + viewport.width;
  const yMin = scrollY + viewport.y;
  const yMax = yMin + viewport.height;

  const dataIndexs = Object.keys(viewCellWidths).filter(dataIndex => {
    const x = viewCellWidths[dataIndex]
    return xMin <= x && x <= xMax;
  })

  const { start, end } = viewCellHeights.getIndexRange(yMin, yMax)

  return [start, end, dataIndexs]
}
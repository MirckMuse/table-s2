import { ITableColumn } from '../typing'
/**
 * TODO: 获取最后一列信息
 */
export function getLastColumns(columns: ITableColumn) {
  throw new Error("TODO: 等待实现")
}

/**
 * TODO: 根据最后一列信息，获取冻结的列
 */
export function getFrozenCount(lastColumns: ITableColumn[]) {
  let frozenColCount = 0
  const leftQueue = ([] as ITableColumn[]).concat(lastColumns)
  while (leftQueue.length) {
    const top = leftQueue.shift()
    if (!top) break

    if (top.fixed === true || top.fixed === 'left') {
      frozenColCount++
      continue
    }
    break
  }

  let frozenTrailingColCount = 0
  const rightQueue = ([] as ITableColumn[]).concat(lastColumns)

  while (rightQueue.length) {
    const last = rightQueue.pop()
    if (!last) break

    if (last.fixed === 'right') {
      frozenTrailingColCount++
      continue
    }
    break
  }

  return {
    frozenColCount,
    frozenTrailingColCount
  }
}
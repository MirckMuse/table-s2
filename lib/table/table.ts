import style from './table.css?inline';
import { GEvent, Meta, S2CellType, S2Event, S2Options, TableSheet, ViewMeta } from '@antv/s2';
import { DefaultTheme } from './theme';
import { Tooltip_Strategy } from './tooltip';
import { ISize, ITableColumn, TableData } from './typing';

/**
 * s2 table的template
 */
const tableTemplate = `
<template id="root">
    <style>
    ${style}
    </style>

    <div id="s2-table-container">    
      <div class="s2-table"></div>
      <div class="s2-table__loading"></div>
      <div class="s2-table__tooltip"></div>
    </div>
</template>
`;

export class S2Table extends HTMLElement {
  rootElement: HTMLDivElement | null = null;

  constructor() {
    super();

    this.attachShadow({ mode: "open" })
    if (!this.shadowRoot) return

    this.shadowRoot.innerHTML = tableTemplate;

    const template = this.shadowRoot.getElementById('root') as HTMLTemplateElement

    if (!template) return

    const templateContent = template.content;

    this.shadowRoot.appendChild(templateContent.cloneNode(true));

    this.init();
  }

  init() {
    this.initElement()
    this.initContainer()
  }

  // table 容器
  s2TableElement: HTMLDivElement | null = null;
  // table 的tooltip
  s2TableTooltip: HTMLDivElement | null = null;

  // 初始化元素
  initElement() {
    if (!this.shadowRoot) return

    this.rootElement = this.shadowRoot.querySelector('#s2-table-container') as HTMLDivElement
    this.s2TableElement = this.shadowRoot.querySelector('.s2-table') as HTMLDivElement
    this.s2TableTooltip = this.shadowRoot.querySelector('.s2-table__tooltip') as HTMLDivElement
  }

  tableContainer: TableSheet | null = null;

  size: ISize = { width: 0, height: 0 }

  // 初始化table容器
  initContainer() {
    if (!this.shadowRoot || !this.s2TableElement) return

    const { clientHeight = 400, clientWidth = 600 } = this.rootElement || {}

    const s2Option: S2Options = { width: clientWidth, height: clientHeight }

    if (!this.s2Columns.length) return

    // 渲染s2的表格
    this.tableContainer = this.tableContainer || new TableSheet(
      this.s2TableElement,
      {
        data: this.dataSource || [],
        fields: { columns: this.s2Columns },
        meta: this.s2Meta
      },
      s2Option
    )
    this.tableContainer.setThemeCfg(DefaultTheme)
    this.tableContainer.render()
    this.initEvent()
  }

  // 初始化事件
  initEvent() {
    if (!this.tableContainer) return

    // TODO: 目前的tooltip没有延迟效果，需要修正
    let previewCell: S2CellType<ViewMeta> | null | undefined = null
    // tooltip事件
    this.tableContainer.on(S2Event.GLOBAL_HOVER, (event: GEvent) => {
      const cell = this.tableContainer?.getCell(event.target)
      if (cell !== previewCell && this.s2TableTooltip) {
        this.s2TableTooltip.innerText = ''
      }

      previewCell = cell

      if (!cell || !this.s2TableTooltip) return

      const strategy = Tooltip_Strategy[cell.cellType]
      if (!strategy) return

      const tooltipText = strategy(cell)
      if (tooltipText) {
        this.s2TableTooltip.style.top = `${event.clientY}px`
        this.s2TableTooltip.style.left = `${event.clientX}px`
        this.s2TableTooltip.innerText = tooltipText
      }
    })
  }

  // 列配置信息
  private _columns: ITableColumn[] = [];
  get columns() {
    return this._columns
  }
  set columns(columns: ITableColumn[]) {
    this._columns = columns;

    setTimeout(() => this.initContainer())
  }

  // 行数据
  private _dataSource: TableData[] = [];
  get dataSource(): TableData[] {
    return this._dataSource;
  }
  set dataSource(value: TableData[]) {
    this._dataSource = value;
  }

  // 列配置信息
  get s2Columns() {
    return this.columns.map(column => column.dataIndex)
  }

  // 元信息
  get s2Meta() {
    return this.columns.map<Meta>(column => {
      return {
        field: column.dataIndex,
        name: column.title
      }
    })
  }
}

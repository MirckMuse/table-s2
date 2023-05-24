import style from './table.css?inline';
import { Canvas, CanvasEvent } from '@antv/g'
import { Renderer } from '@antv/g-canvas'
import { ITableColumn, TableData, ITableTheme, ISize, ICellMeta } from './typing'
import HeaderCell from './cell/head'
import { DefaultTheme } from './theme'

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
    </div>
</template>
`;

export class S2Table extends HTMLElement {
  rootElement: HTMLDivElement | null = null;

  s2TableElement: HTMLDivElement | null = null;

  theme: ITableTheme = DefaultTheme;

  constructor(theme = DefaultTheme) {
    super();
    this.theme = theme

    this.attachShadow({ mode: "open" })
    if (!this.shadowRoot) return

    this.shadowRoot.innerHTML = tableTemplate;

    const template = this.shadowRoot.getElementById('root') as HTMLTemplateElement

    if (!template) return

    const templateContent = template.content;

    this.shadowRoot.appendChild(templateContent.cloneNode(true));

    this.rootElement = this.shadowRoot.querySelector('#s2-table-container') as HTMLDivElement
    this.s2TableElement = this.shadowRoot.querySelector('.s2-table') as HTMLDivElement

    this.init();
  }

  init() {
    this.initContainer()
    this.render()
  }

  tableContainer: Canvas | null = null;

  size: ISize = {
    width: 0,
    height: 0
  }

  // 初始化table容器
  initContainer() {
    if (!this.shadowRoot || !this.s2TableElement) return

    const { clientHeight = 400, clientWidth = 600 } = this.rootElement || {}

    this.size = { width: clientWidth, height: clientHeight }
    this.tableContainer = new Canvas({
      container: this.s2TableElement,
      width: clientWidth,
      height: clientHeight,
      renderer: new Renderer()
    })
  }

  // 列配置信息
  private _columns: ITableColumn[] = [];
  get columns() {
    return this._columns
  }
  set columns(columns: ITableColumn[]) {
    this._columns = columns
    this.render()
  }

  // 行数据
  private _dataSource: TableData[] = [];
  get dataSource(): TableData[] {
    return this._dataSource;
  }
  set dataSource(value: TableData[]) {
    this._dataSource = value;
    this.render()
  }

  renderTHead() {
    const lastColumns = this.columns

    const unitWidth = this.size.width / lastColumns.length
    const { height = 32 } = this.theme.headCell ?? {}

    lastColumns.forEach((column, index) => {
      const headCellMeta: ICellMeta = { position: { x: index * unitWidth, y: 0 }, size: { width: unitWidth, height } }
      new HeaderCell(this, headCellMeta, column)
    })
  }

  realRender() {
    if (!this.shadowRoot || !this.tableContainer) return

    this.renderTHead()
  }

  render() {
    if (!this.shadowRoot || !this.tableContainer) return

    this.tableContainer.ready.then(() => this.realRender())
  }
}

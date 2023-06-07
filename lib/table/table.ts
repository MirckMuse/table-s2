import {
	GEvent,
	Meta,
	S2CellType,
	S2DataConfig,
	S2Event,
	S2Options,
	TableSheet,
	ViewMeta,
	SpreadSheet,
} from "@antv/s2";
import { throttle } from "lodash-es";
import style from "./table.css?inline";
// import { DefaultTheme } from './theme';
import { Tooltip_Strategy } from "./tooltip";
import { ITableColumn, TableData } from "./typing";
import { getFrozenCount } from "./utils";
import TableDataCell from "./cell/DataCell";
import TableColCell from "./cell/ColCell";

export class S2Table extends HTMLElement {
	rootElement: HTMLDivElement | null = null;

	/**
	 * 是否携带边框
	 */
	bordered = false;

	constructor() {
		super();

		this.init();
	}

	init() {
		// 初始化元素
		this.initElement();
		// 初始化s2的容器
		this.initContainer();
	}

	// table 容器
	s2TableElement: HTMLDivElement | null = null;
	// loading元素
	s2TableLoading: HTMLDivElement | null = null;
	// tooltip的元素
	s2TableTooltip: HTMLDivElement | null = null;
	// 样式元素
	styleElment: HTMLStyleElement | null = null;

	// 初始化元素
	initElement() {
		// 创建样式元素
		this.styleElment = document.createElement("style");
		this.styleElment.innerHTML = style;
		this.appendChild(this.styleElment);

		// 创建s2容器元素
		this.s2TableElement = document.createElement("div");
		this.s2TableElement.classList.add("s2-table");

		// 创建loading元素
		this.s2TableLoading = document.createElement("div");
		this.s2TableLoading.classList.add("s2-table__loading");

		// 创建tooltip元素
		this.s2TableTooltip = document.createElement("div");
		this.s2TableTooltip.classList.add("s2-table__tooltip");
		this.s2TableTooltip.style.display = "none";

		// 创建根元素
		this.rootElement = document.createElement("div");
		this.rootElement.id = "s2-table-container";

		// 将元素插入到子节点
		this.rootElement.appendChild(this.s2TableElement);
		this.rootElement.appendChild(this.s2TableLoading);
		this.rootElement.appendChild(this.s2TableTooltip);
		this.appendChild(this.rootElement);
	}

	tableContainer: SpreadSheet | null = null;

	// 初始化table容器
	initContainer() {
		if (!this.s2TableElement) return;

		if (!this.s2Columns.length) return;

		const { clientHeight = 400, clientWidth = 600 } = this.rootElement || {};

		const { frozenColCount, frozenTrailingColCount } = this.frozenCount;

		const s2Option: S2Options = {
			width: clientWidth,
			height: clientHeight,
			frozen: {
				colCount: frozenColCount,
				trailingColCount: frozenTrailingColCount,
			},
			interaction: {
				resize: {
					colCellVertical: false,

					visible(cell: S2CellType) {
						if (cell instanceof TableColCell) {
							const column = (cell as TableColCell).column;

							return column?.resizable ?? false;
						}

						return false;
					},
				},
			},
			dataCell: (meta) => {
				return new TableDataCell(meta, meta?.spreadsheet, this.columnMeta);
			},
			colCell: (node, s2, headConfig) => {
				return new TableColCell(node, s2, {
					...headConfig,
					columnMeta: this.columnMeta,
				});
			},
		};

		const s2DataOption: S2DataConfig = {
			data: this.dataSource || [],
			fields: { columns: this.s2Columns },
			meta: this.s2Meta,
		};

		// 渲染s2的表格
		this.tableContainer =
			this.tableContainer ||
			new TableSheet(this.s2TableElement, s2DataOption, s2Option);
		// this.tableContainer.setThemeCfg(DefaultTheme)
		this.tableContainer.render();
		this.initEvent();
	}

	// 初始化事件
	initEvent() {
		if (!this.tableContainer) return;

		// TODO: 目前的tooltip没有延迟效果，需要修正
		let previewCell: S2CellType<ViewMeta> | null | undefined = null;
		// 每24毫秒执行一次
		const throttleTooltip = throttle((event: GEvent) => {
			const cell = this.tableContainer?.getCell(event.target);
			if (cell !== previewCell && this.s2TableTooltip) {
				this.s2TableTooltip.style.display = "none";
				this.s2TableTooltip.innerText = "";
			}

			previewCell = cell;

			if (!cell || !this.s2TableTooltip) return;

			const strategy = Tooltip_Strategy[cell.cellType];
			if (!strategy) return;

			const tooltipText = strategy(cell);
			if (tooltipText) {
				const meta = cell.getMeta();

				const assignStyle = {
					display: "block",
					left: `${meta.x}px`,
					top: `${event.y + 20}px`,
				};
				Object.assign(this.s2TableTooltip.style, assignStyle);
				this.s2TableTooltip.innerText = tooltipText;
			}
		}, 24);

		// tooltip事件
		this.tableContainer.on(S2Event.GLOBAL_HOVER, throttleTooltip);
	}

	// 列配置信息
	private _columns: ITableColumn[] = [];
	get columns() {
		return this._columns;
	}
	set columns(columns: ITableColumn[]) {
		this._columns = columns;

		setTimeout(() => this.initContainer());
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
		return this.columns.map((column) => column.dataIndex);
	}

	// 元信息
	get s2Meta() {
		return this.columns.map<Meta>((column) => {
			return {
				field: column.dataIndex,
				name: column.title,
				align: column.align,
			};
		});
	}

	get frozenCount() {
		return getFrozenCount(this.columns);
	}

	get columnMeta() {
		// TODO: 需要遍历每一个单元格
		return this.columns.reduce<Record<string, ITableColumn>>((map, column) => {
			map[column.dataIndex] = column;
			return map;
		}, {});
	}
}

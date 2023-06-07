import { BaseHeaderConfig, ColCell } from "@antv/s2";
import { ITableColumn } from "../typing";

function pickStyle(column?: ITableColumn) {
	if (!column) return {};

	return {
		textAlign: column.align,
	};
}

export default class TableColCell extends ColCell {
	protected columnMeta: Record<string, ITableColumn> = {};

	column: ITableColumn | null = null;

	/**
	 * @param
	 */
	protected handleRestOptions(
		...[conf]: [BaseHeaderConfig & { columnMeta: Record<string, ITableColumn> }]
	): void {
		super.handleRestOptions(conf);
		this.columnMeta = conf.columnMeta;
		this.column = this.columnMeta[this.meta.field];
	}

	getTextStyle() {
		const style = super.getTextStyle();

		if (this.column) {
			Object.assign(style, pickStyle(this.column));
		}

		return style;
	}
}

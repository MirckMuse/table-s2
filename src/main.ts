import "./style.css";

import "../lib";

const App = document.querySelector<HTMLDivElement>("#app");

function initTable() {
	const s2 = document.querySelector<HTMLDivElement>("#s2") as any;
	if (!s2) return;

	const keys = Array(10)
		.fill(null)
		.map((_, index) => `dept${index}`);
	const columns = keys.map((key, index) => {
		let fixed: any = false;
		if (index < 3) {
			fixed = "left";
		} else if (index > 7) {
			fixed = "right";
		}
		return {
			title: `${key}CN`,
			dataIndex: key,
			fixed,
			align: "left",
			resizable: index === 5,
		};
	});

	const dataSource = Array(10)
		.fill(null)
		.map((_, index) => {
			return keys.reduce<any>((data, key, colIndex) => {
				if (colIndex !== 7) {
					data[key] = `${key}-${index}`;
				}
				return data;
			}, {});
		});

	s2.columns = columns;
	s2.dataSource = dataSource;
}

if (App) {
	App.innerHTML = `
  <s2-table id="s2" bordered="true"></s2-table>
  `;

	initTable();
}

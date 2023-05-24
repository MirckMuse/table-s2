import "./style.css";

import "../lib";

const App = document.querySelector<HTMLDivElement>("#app");

function initTable() {
  const s2 = document.querySelector<HTMLDivElement>("#s2") as any;
  if (!s2) return

  const keys = Array(10).fill(null).map((_, index) => `dept${index}`);
  const columns = keys.map(key => ({ title: key, dataIndex: key }))
  const dataSource = Array(10).fill(null).map((_, index) => {
    return keys.reduce<any>((data, key) => {
      data[key] = `${key}-${index}`
      return data
    }, {})
  })

  s2.columns = columns
  s2.dataSource = dataSource
}

if (App) {
  App.innerHTML = `
  <s2-table id="s2" style="margin: 10px"></s2-table>
  `;

  initTable()
}

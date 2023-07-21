import { TableSheet } from '../packages/table/src'
import './style.css'

const App = document.querySelector<HTMLDivElement>("#app");

function initTable(dom: HTMLElement) {
  const sheet = new TableSheet(dom, {
    columns: [],
    dataSource: []
  }, {})

  sheet.render()
}

if (App) {
  App.innerHTML = `
  <s2-table id="s2" bordered="true"></s2-table>
  `;

  const tableElement = document.querySelector('#s2')

  tableElement && initTable(tableElement as HTMLElement);
}

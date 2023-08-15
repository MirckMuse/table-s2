import { TableSheet } from '../packages/table/src'
import './style.css'

const App = document.querySelector<HTMLDivElement>("#app");

function initTable(dom: HTMLElement) {
  const sheet = new TableSheet(dom, {
    columns: Array(10).fill(null).map((_, index) => {
      return { dataIndex: `a${index}`, title: `a${index}` }
    }),
    dataSource: Array(10).fill(null).map((_, index) => {
      return Array(10).fill(null).reduce<any>((item, _, index) => {
        item[`a${index}`] = index
        return item
      }, {})
    })
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

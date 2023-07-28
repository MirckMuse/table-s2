import { TableSheet } from '../packages/table/src'
import './style.css'

const App = document.querySelector<HTMLDivElement>("#app");

function initTable(dom: HTMLElement) {
  const sheet = new TableSheet(dom, {
    columns: [{ dataIndex: 'a', title: '12' }],
    dataSource: Array(10).fill(null).map((_, index) => {
      return {
        a: 'a' + index
      }
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

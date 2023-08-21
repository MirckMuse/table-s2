import { TableSheet } from '../packages/table/src'
import './style.css'

const App = document.querySelector<HTMLDivElement>("#app");

function initTable(dom: HTMLElement) {
  const sheet = new TableSheet(dom,
    {
      columns: [
        { dataIndex: 'a0', title: 'a0' },
        { dataIndex: 'a1', title: 'a1' },
        {
          dataIndex: '', title: '分组',
          children: [
            { dataIndex: 'a2', title: 'a2' },
            { dataIndex: 'a3', title: 'a3' },
          ]
        },
        { dataIndex: 'a4', title: 'a4' },
        { dataIndex: 'a5', title: 'a5' },
        { dataIndex: 'a6', title: 'a6' },
        { dataIndex: 'a7', title: 'a7' },
        { dataIndex: 'a8', title: 'a8' },
        { dataIndex: 'a9', title: 'a9' },
      ],
      dataSource: Array(100).fill(null).map((_, rowIndex) => {
        return Array(10).fill(null).reduce<any>((item, _, index) => {
          if (!index) {
            item[`a${index}`] = rowIndex
          } else {
            item[`a${index}`] = `${index}`
          }
          return item
        }, {})
      })
    },
    { adaptive: false }
  )

  sheet.render()
}

if (App) {
  App.innerHTML = `
  <s2-table id="s2" bordered="true"></s2-table>
  `;

  const tableElement = document.querySelector('#s2')

  tableElement && initTable(tableElement as HTMLElement);
}

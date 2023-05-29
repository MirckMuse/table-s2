import { ThemeCfg } from '@antv/s2'

export const headCell = {
  height: 32,
  fontSize: 16,
  color: "#333",
  background: '#FAFAFA',
  borderColor: '#F0F0F0'
}

export const DefaultTheme: ThemeCfg = {
  theme: {
    // 列头单元格
    colCell: {
      cell: {
        backgroundColor: '#FAFAFA',
        horizontalBorderColor: '#F0F0F0',
        verticalBorderColor: '#F0F0F0',
        verticalBorderWidth: 0
      },
      bolderText: {
        textAlign: 'left'
      },
      text: {
        textAlign: 'left'
      }
    },

    // 数值单元格
    dataCell: {
      cell: {
        crossBackgroundColor: '#fff',
        backgroundColor: '#fff',
        horizontalBorderColor: '#F0F0F0',
        verticalBorderColor: '#F0F0F0',
        verticalBorderWidth: 0
      },
      text: {
        textAlign: 'left'
      }
    },

    // 分割线
    splitLine: {
      horizontalBorderColor: '#F0F0F0',
      horizontalBorderColorOpacity: 1,
      horizontalBorderWidth: 1,
      verticalBorderColor: '#F0F0F0',
      verticalBorderColorOpacity: 1,
      verticalBorderWidth: 1
    }
  },

}
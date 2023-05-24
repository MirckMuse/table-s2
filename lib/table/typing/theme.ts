export interface ITableCellTheme {
  height?: number;

  color?: string;

  borderColor?: string;

  background?: string;

  fontSize?: number;
}

export interface ITableTheme {
  headCell?: ITableCellTheme;
}
// types.ts
export interface TableColumn<T = any> {
  Header: string | (() => React.ReactNode);
  accessor: keyof T | string;
  id?: string;
  width?: number;
  maxWidth?: number;
  minWidth?: number;

  Cell?: (props: CellProps<T>) => React.ReactNode;
}

export interface CellProps<T = any> {
  row: T;
  value: any;
  toggleExpand?: () => void;
  isExpanded?: boolean;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  renderRowSubComponent?: (args: { row: T }) => React.ReactNode;
  showCheckboxes?: boolean;
  allowSingleSelect?: boolean;
  pageSize?: number;
  hideFilter?: boolean;
  hiddenColumns?: string[];
  loading?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
}

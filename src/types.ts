interface Database {
  name: string
  tables: Table[]

  createTable(name: string): Table
}

interface Table {
  name: string
  columns: Column[]

  addColumn(name: string, type: string): void
}

interface Column {
  name: string
  type: Type
}

type Type =
  | 'number'
  | 'string'

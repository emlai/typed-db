type AddColumn<Tables, TableName extends keyof Tables, Name extends string, ColumnType> = Database<
  Tables & { [k in TableName]: Tables[TableName] & { [k in Name]: ColumnType } }
>

export type TablesObject<Tables> = { [k in keyof Tables]: Table<Tables[k]> }

export interface Database<Tables> {
  name: string
  tables: TablesObject<Tables>

  createTable<Name extends string>(name: Name): Database<Tables & { [k in Name]: {} }>

  addColumn<TableName extends keyof Tables, Name extends string>(
    table: TableName,
    name: Name,
    type: Type.number
  ): AddColumn<Tables, TableName, Name, number>

  addColumn<TableName extends keyof Tables, Name extends string>(
    table: TableName,
    name: Name,
    type: Type.string
  ): AddColumn<Tables, TableName, Name, string>

  insert<TableName extends keyof Tables>(table: TableName, row: Tables[TableName]): Database<Tables>

  insertMultiple<TableName extends keyof Tables>(
    table: TableName,
    rows: readonly (Tables[TableName])[]
  ): Database<Tables>

  getAll<TableName extends keyof Tables>(table: TableName): readonly (Tables[TableName])[]

  getAll<TableName extends keyof Tables>(
    table: TableName,
    conditions: Partial<Tables[TableName]>
  ): readonly (Tables[TableName])[]

  update<TableName extends keyof Tables>(table: TableName, updates: Partial<Tables[TableName]>): Database<Tables>
}

export interface Table<Row> {
  name: string
  columns: Column[]
  rows: Row[]
}

interface Column {
  name: string
  type: Type
}

export enum Type {
  number = 'number',
  string = 'string'
}

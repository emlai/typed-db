type AddColumn<Tables, TableName extends keyof Tables, Name extends string, ColumnType> = Database<
  Tables & { [k in TableName]: Tables[TableName] & { [k in Name]: ColumnType } }
>

type TablesObject<Tables> = { [k in keyof Tables]: Table<Tables[k]> }

interface Database<Tables> {
  name: string
  tables: TablesObject<Tables>

  createTable<Name extends string>(name: Name): Database<Tables & { [k in Name]: {} }>

  addColumn<TableName extends keyof Tables, Name extends string>(
    table: TableName,
    name: Name,
    type: Type
  ): AddColumn<Tables, TableName, Name, Type>

  addColumn<TableName extends keyof Tables, Name extends string>(
    table: TableName,
    name: Name,
    type: 'number'
  ): AddColumn<Tables, TableName, Name, number>

  addColumn<TableName extends keyof Tables, Name extends string>(
    table: TableName,
    name: Name,
    type: 'string'
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
}

interface Table<Row> {
  name: string
  columns: Column[]
  rows: Row[]
}

interface Column {
  name: string
  type: Type
}

type Type = 'number' | 'string'

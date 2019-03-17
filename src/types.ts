interface Database {
  name: string
  tables: Table[]

  createTable(name: string): void
}

interface Table {
  name: string
}

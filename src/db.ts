import fs from 'fs'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const unlink = promisify(fs.unlink)

function createDatabaseFilename(name: string): string {
  return name + '.db'
}

function createTableInterface(name: string): Table<{}> {
  return {
    name,
    columns: [],
    rows: []
  }
}

function createDatabaseInterface<Tables>(
  name: string,
  tables: TablesObject<Tables>
): Database<Tables> {
  return {
    name,
    tables,

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    createTable<Name extends string>(name: Name) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tables = this.tables as any
      tables[name] = createTableInterface(name)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this as any
    },

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    addColumn(table: keyof Tables, name: string, type: Type) {
      this.tables[table].columns.push({ name, type })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this as any
    },

    insert<TableName extends keyof Tables>(table: TableName, row: Tables[TableName]): Database<Tables> {
      this.tables[table].rows.push(row)
      return this
    },

    insertMultiple<TableName extends keyof Tables>(table: TableName, rows: readonly (Tables[TableName])[]): Database<Tables> {
      this.tables[table].rows.push(...rows)
      return this
    }
  }
}

export function createDatabase(name: string): Database<{}> {
  return createDatabaseInterface(name, {})
}

export async function saveDatabase(db: Database<{}>): Promise<void> {
  await writeFile(createDatabaseFilename(db.name), JSON.stringify(db.tables))
}

export async function loadDatabase<Tables>(name: string): Promise<Database<Tables>> {
  const buffer = await readFile(createDatabaseFilename(name))
  const tables = await JSON.parse(buffer.toString())
  return createDatabaseInterface(name, tables)
}

export async function deleteDatabase(name: string): Promise<void> {
  await unlink(createDatabaseFilename(name))
}

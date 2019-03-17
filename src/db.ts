import fs from 'fs'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const unlink = promisify(fs.unlink)

function createDatabaseFilename(name: string): string {
  return name + '.db'
}

function createDatabaseInterface(name: string, tables: Table[]): Database {
  return {
    name,
    tables,

    createTable(name: string) {
      this.tables.push({ name })
    },
  }
}

export function createDatabase(name: string): Database {
  return createDatabaseInterface(name, [])
}

export async function saveDatabase(db: Database): Promise<void> {
  await writeFile(createDatabaseFilename(db.name), JSON.stringify(db.tables))
}

export async function loadDatabase(name: string): Promise<Database> {
  const buffer = await readFile(createDatabaseFilename(name))
  const tables = await JSON.parse(buffer.toString())
  return createDatabaseInterface(name, tables)
}

export async function deleteDatabase(name: string): Promise<void> {
  await unlink(createDatabaseFilename(name))
}

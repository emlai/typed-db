import { promises as fs } from 'fs'
import { Database, Property } from './types'
import { createCollectionInterface, createDatabaseInterface } from './db'

type DatabaseJson = {
  name: string
  collections: Record<string, { properties: Property[]; objects: object[] }>
}

export async function createDatabase(name: string, path: string): Promise<Database<{}>> {
  const db = createDatabaseInterface(name, path, {})
  await saveDatabase(db, path)
  return db
}

export async function saveDatabase(db: DatabaseJson, path: string): Promise<void> {
  await fs.writeFile(path, JSON.stringify({ name: db.name, collections: db.collections }))
}

export async function loadDatabaseData(path: string): Promise<DatabaseJson> {
  const buffer = await fs.readFile(path)
  return JSON.parse(buffer.toString())
}

export async function loadDatabase(path: string): Promise<Database> {
  const data = await loadDatabaseData(path)
  const db = createDatabaseInterface(data.name, path, {})
  for (const key in data.collections) {
    (db as any)[key] = createCollectionInterface(null, db, key, data.collections[key].properties)
  }
  return db
}

export async function deleteDatabase(db: Database): Promise<void> {
  await fs.unlink(db._path)
}

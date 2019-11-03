import { createDatabase, deleteDatabase, loadDatabase, saveDatabase } from '../src/db'

export async function runTestMigration(migration: (db: Database) => void): Promise<Database> {
  const dbName = 'test_database'
  const db = createDatabase(dbName)
  migration(db)
  await saveDatabase(db)

  const loadedDB = await loadDatabase(dbName)
  await deleteDatabase(dbName)
  return loadedDB
}

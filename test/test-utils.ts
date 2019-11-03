import { createDatabase, deleteDatabase, loadDatabase, saveDatabase } from '../src/db'

type Migration<Old, New> = (db: Database<Old>) => Database<New>

export async function runTestMigration<New>(migration: Migration<{}, New>): Promise<Database<New>> {
  const dbName = 'test_database'
  const db = createDatabase(dbName)
  migration(db)
  await saveDatabase(db)

  const loadedDB = await loadDatabase<New>(dbName)
  await deleteDatabase(dbName)
  return loadedDB
}

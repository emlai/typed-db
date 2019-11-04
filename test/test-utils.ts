import { promises as fs } from 'fs'
import * as path from 'path'
import * as os from 'os'
import { createDatabase, deleteDatabase, loadDatabase, saveDatabase } from '../src/db'
import { Database } from '../src/types'

type Migration<Old, New> = (db: Database<Old>) => Database<New>

export async function createTestDatabase() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'typed-db_'))
  const dbName = 'test_database'
  const dbPath = path.join(dir, dbName + '.db')
  const db = createDatabase(dbName)
  return { dbPath, db }
}

export async function runTestMigration<New>(migration: Migration<{}, New>): Promise<Database<New>> {
  const { dbPath, db } = await createTestDatabase()
  migration(db)
  await saveDatabase(db, dbPath)

  const loadedDB = await loadDatabase<New>(dbPath)
  await deleteDatabase(dbPath)
  return loadedDB
}

import { promises as fs } from 'fs'
import * as path from 'path'
import * as os from 'os'
import { createDatabase, deleteDatabase, loadDatabase, saveDatabase } from '../src/db'

type Migration<Old, New> = (db: Database<Old>) => Database<New>

export async function runTestMigration<New>(migration: Migration<{}, New>): Promise<Database<New>> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'typed-db_'))
  const dbName = 'test_database'
  const dbPath = path.join(dir, dbName + '.db')
  const db = createDatabase(dbName)
  migration(db)
  await saveDatabase(db, dbPath)

  const loadedDB = await loadDatabase<New>(dbPath)
  await deleteDatabase(dbPath)
  return loadedDB
}

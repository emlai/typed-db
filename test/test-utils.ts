import { promises as fs } from 'fs'
import * as path from 'path'
import * as os from 'os'
import { createDatabase, loadDatabase } from '../src/storage'
import { Database, QueryBuilder } from '../src/types'

type Migration<Old, New> = (db: Database<Old>) => QueryBuilder<New>

export async function createTestDatabase() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'typed-db_'))
  const dbName = 'test_database'
  const dbPath = path.join(dir, dbName + '.db')
  return await createDatabase(dbName, dbPath)
}

export async function runTestMigration<New>(migration: Migration<{}, New>): Promise<Database<New>> {
  const db = await createTestDatabase()
  await migration(db).save()
  return await loadDatabase(db._path)
}

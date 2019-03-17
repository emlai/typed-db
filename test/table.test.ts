import { createDatabase, deleteDatabase, loadDatabase, saveDatabase } from '../src/db'

async function runTestMigration(migration: (db: Database) => void): Promise<Database> {
  const dbName = 'test_database'
  const db = createDatabase(dbName)
  migration(db)
  await saveDatabase(db)

  const loadedDB = await loadDatabase(dbName)
  await deleteDatabase(dbName)
  return loadedDB
}

test('table can be created', async () => {
  const db = await runTestMigration(db => {
    db.createTable('orders')
  })

  const table: Table = { name: 'orders' }
  expect(db.tables).toEqual([table])
})

test('multiple tables can be created', async () => {
  const db = await runTestMigration(db => {
    db.createTable('orders')
    db.createTable('customers')
  })

  const table1: Table = { name: 'orders' }
  const table2: Table = { name: 'customers' }
  expect(db.tables).toHaveLength(2)
  expect(db.tables).toEqual(expect.arrayContaining([table1, table2]))
})

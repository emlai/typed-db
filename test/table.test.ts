import { runTestMigration } from './test-utils'

test('table can be created', async () => {
  const db = await runTestMigration(db => {
    db.createTable('orders')
  })

  expect(db.tables).toEqual([{ name: 'orders', columns: [] }])
})

test('multiple tables can be created', async () => {
  const db = await runTestMigration(db => {
    db.createTable('orders')
    db.createTable('customers')
  })

  expect(db.tables).toStrictEqual([{ name: 'orders', columns: [] }, { name: 'customers', columns: [] }])
})

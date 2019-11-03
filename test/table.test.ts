import { runTestMigration } from './test-utils'

test('table can be created', async () => {
  const db = await runTestMigration(db => db.createTable('orders'))

  expect(db.tables).toEqual({
    orders: { name: 'orders', columns: [], rows: [] }
  })
})

test('multiple tables can be created', async () => {
  const db = await runTestMigration(db => db.createTable('orders').createTable('customers'))

  expect(db.tables).toStrictEqual({
    orders: { name: 'orders', columns: [], rows: [] },
    customers: { name: 'customers', columns: [], rows: [] }
  })
})

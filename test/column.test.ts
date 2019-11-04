import { runTestMigration } from './test-utils'

test('columns can be added', async () => {
  const db = await runTestMigration(db =>
    db
      .createTable('orders')
      .addColumn('orders', 'id', 'string')
      .addColumn('orders', 'price', 'number')
  )

  expect(db.tables.orders.columns).toStrictEqual([{ name: 'id', type: 'string' }, { name: 'price', type: 'number' }])
})

test('columns can be added after adding rows', async () => {
  const db = await runTestMigration(db =>
    db
      .createTable('orders')
      .addColumn('orders', 'id', 'string')
      .addColumn('orders', 'price', 'number')
      .insertMultiple('orders', [{ id: 'b', price: 2 }, { id: 'a', price: 1 }, { id: 'c', price: 2 }])
      .addColumn('orders', 'info', 'string')
      .update('orders', { info: 'default' })
  )

  expect(db.tables.orders.columns).toStrictEqual([
    { name: 'id', type: 'string' },
    { name: 'price', type: 'number' },
    { name: 'info', type: 'string' }
  ])
  expect(db.getAll('orders')).toStrictEqual([
    { id: 'b', price: 2, info: 'default' },
    { id: 'a', price: 1, info: 'default' },
    { id: 'c', price: 2, info: 'default' }
  ])
})

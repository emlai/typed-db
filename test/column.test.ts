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

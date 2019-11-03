import { runTestMigration } from './test-utils'

test('rows can be added', async () => {
  const db = await runTestMigration(db =>
    db
      .createTable('orders')
      .addColumn('orders', 'id', 'string')
      .addColumn('orders', 'price', 'number')
      .insert('orders', { id: 'a', price: 1 })
      .insertMultiple('orders', [{ id: 'b', price: 2 }, { id: 'c', price: 2 }])
  )

  expect(db.tables.orders.rows).toStrictEqual([{ id: 'a', price: 1 }, { id: 'b', price: 2 }, { id: 'c', price: 2 }])
})

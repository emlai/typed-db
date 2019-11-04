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

test('rows can be updated', async () => {
  const db = await runTestMigration(db =>
    db
      .createTable('orders')
      .addColumn('orders', 'id', 'string')
      .addColumn('orders', 'price', 'number')
      .insertMultiple('orders', [{ id: 'a', price: 2 }, { id: 'b', price: 1 }, { id: 'c', price: 2 }])
      .update('orders', { price: 3 })
  )
  expect(db.tables.orders.rows).toStrictEqual([{ id: 'a', price: 3 }, { id: 'b', price: 3 }, { id: 'c', price: 3 }])

  db.update('orders', { price: 0, id: '' })
  expect(db.tables.orders.rows).toStrictEqual([{ id: '', price: 0 }, { id: '', price: 0 }, { id: '', price: 0 }])
})

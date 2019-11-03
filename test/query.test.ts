import { runTestMigration } from './test-utils'

test('getAll', async () => {
  const db = await runTestMigration(db =>
    db
      .createTable('orders')
      .addColumn('orders', 'id', 'string')
      .addColumn('orders', 'price', 'number')
      .insert('orders', { id: 'a', price: 1 })
      .insertMultiple('orders', [{ id: 'b', price: 2 }, { id: 'c', price: 2 }])
  )

  const result = db.getAll('orders')
  expect(result).toStrictEqual([{ id: 'a', price: 1 }, { id: 'b', price: 2 }, { id: 'c', price: 2 }])
})

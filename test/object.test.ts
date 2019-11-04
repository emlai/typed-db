import { runTestMigration } from './test-utils'
import { Type } from '../src/types'

test('objects can be added', async () => {
  const db = await runTestMigration(db =>
    db
      .createCollection('orders')
      .addProperty('orders', 'id', Type.string)
      .addProperty('orders', 'price', Type.number)
      .insert('orders', { id: 'a', price: 1 })
      .insertMultiple('orders', [{ id: 'b', price: 2 }, { id: 'c', price: 2 }])
  )

  expect(db.collections.orders.objects).toStrictEqual([
    { id: 'a', price: 1 },
    { id: 'b', price: 2 },
    { id: 'c', price: 2 }
  ])
})

test('objects can be updated', async () => {
  const db = await runTestMigration(db =>
    db
      .createCollection('orders')
      .addProperty('orders', 'id', Type.string)
      .addProperty('orders', 'price', Type.number)
      .insertMultiple('orders', [{ id: 'a', price: 2 }, { id: 'b', price: 1 }, { id: 'c', price: 2 }])
      .update('orders', { price: 3 })
  )
  expect(db.collections.orders.objects).toStrictEqual([
    { id: 'a', price: 3 },
    { id: 'b', price: 3 },
    { id: 'c', price: 3 }
  ])

  db.update('orders', { price: 0, id: '' })
  expect(db.collections.orders.objects).toStrictEqual([
    { id: '', price: 0 },
    { id: '', price: 0 },
    { id: '', price: 0 }
  ])
})

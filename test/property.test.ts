import { runTestMigration } from './test-utils'
import { Type } from '../src/types'

test('properties can be added', async () => {
  const db = await runTestMigration(db =>
    db
      .createCollection('orders')
      .addProperty('orders', 'id', Type.string)
      .addProperty('orders', 'price', Type.number)
  )

  expect(db.collections.orders.properties).toStrictEqual([
    { name: 'id', type: 'string' },
    { name: 'price', type: 'number' }
  ])
})

test('properties can be added after adding objects', async () => {
  const db = await runTestMigration(db =>
    db
      .createCollection('orders')
      .addProperty('orders', 'id', Type.string)
      .addProperty('orders', 'price', Type.number)
      .insertMultiple('orders', [{ id: 'b', price: 2 }, { id: 'a', price: 1 }, { id: 'c', price: 2 }])
      .addProperty('orders', 'info', Type.string)
      .update('orders', { info: 'default' })
  )

  expect(db.collections.orders.properties).toStrictEqual([
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

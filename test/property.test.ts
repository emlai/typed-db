import { runTestMigration } from './test-utils'
import { Type } from '../src/types'

test('properties can be added', async () => {
  const db = await runTestMigration(db =>
    db.createCollection('orders')
      .orders.addProperty('id', Type.string)
      .orders.addProperty('price', Type.number)
  )

  expect(db.orders.properties).toStrictEqual([
    { name: 'id', type: 'string' },
    { name: 'price', type: 'number' }
  ])
})

test('properties can be added after adding objects', async () => {
  const db = await runTestMigration(db =>
    db.createCollection('orders')
      .orders.addProperty('id', Type.string)
      .orders.addProperty('price', Type.number)
      .orders.insertMultiple([{ id: 'b', price: 2 }, { id: 'a', price: 1 }, { id: 'c', price: 2 }])
      .orders.addProperty('info', Type.string)
      .orders.update({ info: 'default' })
  )

  expect(db.orders.properties).toStrictEqual([
    { name: 'id', type: 'string' },
    { name: 'price', type: 'number' },
    { name: 'info', type: 'string' }
  ])
  expect(await db.orders.getAll()).toStrictEqual([
    { id: 'b', price: 2, info: 'default' },
    { id: 'a', price: 1, info: 'default' },
    { id: 'c', price: 2, info: 'default' }
  ])
})

import { runTestMigration } from './test-utils'
import { Type } from '../src/types'

test('objects can be added', async () => {
  const db = await runTestMigration(db =>
    db.createCollection('orders')
      .orders.addProperty('id', Type.string)
      .orders.addProperty('price', Type.number)
      .orders.insert({ id: 'a', price: 1 })
      .orders.insertMultiple([{ id: 'b', price: 2 }, { id: 'c', price: 2 }])
  )

  expect(await db.orders.getAll()).toStrictEqual([{ id: 'a', price: 1 }, { id: 'b', price: 2 }, { id: 'c', price: 2 }])
})

test('objects can be updated', async () => {
  const db = await runTestMigration(db =>
    db.createCollection('orders')
      .orders.addProperty('id', Type.string)
      .orders.addProperty('price', Type.number)
      .orders.insertMultiple([{ id: 'a', price: 2 }, { id: 'b', price: 1 }, { id: 'c', price: 2 }])
      .orders.update({ price: 3 })
  )
  expect(await db.orders.getAll()).toStrictEqual([{ id: 'a', price: 3 }, { id: 'b', price: 3 }, { id: 'c', price: 3 }])

  await db.orders.update({ price: 0, id: '' }).save()
  expect(await db.orders.getAll()).toStrictEqual([{ id: '', price: 0 }, { id: '', price: 0 }, { id: '', price: 0 }])
})

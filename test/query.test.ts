import { runTestMigration } from './test-utils'
import { Type } from '../src/types'

function createTestDatabase() {
  return runTestMigration(db =>
    db.createCollection('orders')
      .orders.addProperty('id', Type.string)
      .orders.addProperty('price', Type.number)
      .orders.insertMultiple([
        { id: 'b', price: 2 },
        { id: 'a', price: 1 },
        { id: 'c', price: 2 }
      ])
  )
}

describe('queries', () => {
  let db: ReturnType<typeof createTestDatabase> extends Promise<infer T> ? T : never

  beforeAll(async () => {
    db = await createTestDatabase()
  })

  test('getAll', async () => {
    expect(await db.orders.getAll()).toStrictEqual([
      { id: 'b', price: 2 },
      { id: 'a', price: 1 },
      { id: 'c', price: 2 }
    ])
  })

  test('getAll with condition', async () => {
    expect(await db.orders.getAll({ price: 2 })).toStrictEqual([
      { id: 'b', price: 2 },
      { id: 'c', price: 2 }
    ])
  })
})

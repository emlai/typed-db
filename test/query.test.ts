import { runTestMigration } from './test-utils'
import { Type } from '../src/types'

function createTestDatabase() {
  return runTestMigration(db =>
    db
      .createCollection('orders')
      .addProperty('orders', 'id', Type.string)
      .addProperty('orders', 'price', Type.number)
      .insertMultiple('orders', [{ id: 'b', price: 2 }, { id: 'a', price: 1 }, { id: 'c', price: 2 }])
  )
}

describe('queries', () => {
  let db: ReturnType<typeof createTestDatabase> extends Promise<infer T> ? T : never

  beforeAll(async () => {
    db = await createTestDatabase()
  })

  test('getAll', () => {
    expect(db.getAll('orders')).toStrictEqual([{ id: 'b', price: 2 }, { id: 'a', price: 1 }, { id: 'c', price: 2 }])
  })

  test('getAll with condition', () => {
    expect(db.getAll('orders', { price: 2 })).toStrictEqual([{ id: 'b', price: 2 }, { id: 'c', price: 2 }])
  })
})

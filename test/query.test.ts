import { runTestMigration } from './test-utils'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createTestDatabase() {
  return runTestMigration(db =>
    db
      .createTable('orders')
      .addColumn('orders', 'id', 'string')
      .addColumn('orders', 'price', 'number')
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

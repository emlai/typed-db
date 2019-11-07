import { runTestMigration } from './test-utils'

test('collections can be created', async () => {
  const db = await runTestMigration(db =>
    db.createCollection('orders')
      .createCollection('customers')
  )
  expect(db).toMatchObject({
    orders: { properties: [] },
    customers: { properties: [] }
  })
})

import { runTestMigration } from './test-utils'

test('collection can be created', async () => {
  const db = await runTestMigration(db => db.createCollection('orders'))

  expect(db.collections).toEqual({
    orders: { name: 'orders', properties: [], objects: [] }
  })
})

test('multiple collections can be created', async () => {
  const db = await runTestMigration(db => db.createCollection('orders').createCollection('customers'))

  expect(db.collections).toStrictEqual({
    orders: { name: 'orders', properties: [], objects: [] },
    customers: { name: 'customers', properties: [], objects: [] }
  })
})

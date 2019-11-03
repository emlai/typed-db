import { runTestMigration } from './test-utils'

test('columns can be added', async () => {
  const db = await runTestMigration(db => {
    const table = db.createTable('orders')
    table.addColumn('id', 'string')
    table.addColumn('price', 'number')
  })

  expect(db.tables[0].columns).toHaveLength(2)
  expect(db.tables[0].columns).toEqual(expect.arrayContaining([
    { name: 'id', type: 'string' },
    { name: 'price', type: 'number' }
  ]))
})

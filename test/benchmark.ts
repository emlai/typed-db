// @ts-ignore
import Benchmarkify from 'benchmarkify'
import { createTestDatabase } from './test-utils'
import { Type } from '../src/types'
import { deleteDatabase, loadDatabase, saveDatabase } from '../src/db'

async function main() {
  const benchmark = new Benchmarkify('typed-db benchmark').printHeader()

  const { dbPath, db: createdDb } = await createTestDatabase()
  const db = createdDb
    .createCollection('orders')
    .orders.addProperty('price', Type.number)
    .orders.addProperty('discount', Type.number)
    .orders.addProperty('name', Type.string)
    .orders.addProperty('description', Type.string)
    .orders.addProperty('date', Type.string)
    .orders.addProperty('customer', Type.string)
    .orders.addProperty('salesperson', Type.string)
  await saveDatabase(db, dbPath)
  type Db = typeof db

  const suite = benchmark.createSuite('Increment integer', { cycles: 10 })

  const randomString = () => Math.random().toString(36)
  const objects = Array.from({ length: 5 }, () => ({
    price: Math.random() * 5000,
    discount: Math.random() < 0.01 ? 20 : 0,
    name: randomString(),
    description: randomString() + randomString() + randomString(),
    date: new Date().toISOString(),
    customer: randomString(),
    salesperson: randomString()
  }))

  suite.add('insert', async (done: Function) => {
    for (const object of objects) {
      const db: Db = await loadDatabase(dbPath)
      db.orders.insert(object)
      await saveDatabase(db, dbPath)
    }
    done()
  })

  suite.add('insertMultiple', async (done: Function) => {
    const db: Db = await loadDatabase(dbPath)
    db.orders.insertMultiple(objects)
    await saveDatabase(db, dbPath)
    done()
  })

  await suite.run()
  await deleteDatabase(dbPath)
}

main()

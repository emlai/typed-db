// @ts-ignore
import Benchmarkify from 'benchmarkify'
import { runTestMigration } from './test-utils'
import { Type } from '../src/types'
import { deleteDatabase } from '../src/storage'

async function main() {
  const benchmark = new Benchmarkify('typed-db benchmark').printHeader()

  const db = await runTestMigration(db =>
    db.createCollection('orders')
      .orders.addProperty('price', Type.number)
      .orders.addProperty('discount', Type.number)
      .orders.addProperty('name', Type.string)
      .orders.addProperty('description', Type.string)
      .orders.addProperty('date', Type.string)
      .orders.addProperty('customer', Type.string)
      .orders.addProperty('salesperson', Type.string)
  )

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
      await db.orders.insert(object).save()
    }
    done()
  })

  suite.add('insertMany', async (done: Function) => {
    await db.orders.insertMany(objects).save()
    done()
  })

  await suite.run()
  await deleteDatabase(db)
}

main()

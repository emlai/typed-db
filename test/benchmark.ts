// @ts-ignore
import benchmark from 'nodemark'
import { runTestMigration } from './test-utils'
import { Type } from '../src/types'
import { deleteDatabase } from '../src/storage'

async function main() {
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

  const randomString = () => Math.random().toString(36)
  const objects = Array.from({ length: 100 }, () => ({
    price: Math.random() * 5000,
    discount: Math.random() < 0.01 ? 20 : 0,
    name: randomString(),
    description: randomString() + randomString() + randomString(),
    date: new Date().toISOString(),
    customer: randomString(),
    salesperson: randomString()
  }))

  const tests: Record<string, Function> = {}

  tests.insert = async () => {
    for (const object of objects) {
      await db.orders.insert(object).save()
    }
  }

  tests.insertMany = async () => {
    await db.orders.insertMany(objects).save()
  }

  const maxKeyLength = Math.max(...Object.keys(tests).map(key => key.length))

  for (const key in tests) {
    const test = tests[key]
    const result = await benchmark((done: Function) => test().then(done))
    console.log(key.padEnd(maxKeyLength), result.toString('milliseconds'))
  }

  await deleteDatabase(db)
}

main()

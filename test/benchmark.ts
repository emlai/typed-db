// @ts-ignore
import benchmark from 'nodemark'
import { sample } from 'lodash'
import { runTestMigration } from './test-utils'
import { Database, Type } from '../src/types'
import { deleteDatabase } from '../src/storage'

async function main() {
  const randomString = () => Math.random().toString(36)
  const objects = Array.from({ length: 10000 }, () => ({
    price: Math.random() * 5000,
    discount: Math.random() < 0.01 ? 20 : 0,
    name: randomString(),
    description: randomString() + randomString() + randomString(),
    date: new Date().toISOString(),
    customer: randomString(),
    salesperson: ''
  }))

  const tests: Record<string, Function> = {}

  tests.insert = async (db: Database) => {
    await db.orders.insert(sample(objects)).save()
  }

  tests.insertMany = async (db: Database) => {
    await db.orders.insertMany([sample(objects)]).save()
  }

  tests.update = async (db: Database) => {
    await db.orders.update({ salesperson: randomString() }).save()
  }

  tests.findAll = async (db: Database) => {
    await db.orders.findAll()
  }

  tests.findAllByProperty = async (db: Database) => {
    await db.orders.findAll({ customer: 'nonexistent' })
  }

  const maxKeyLength = Math.max(...Object.keys(tests).map(key => key.length))

  for (const key in tests) {
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
    await db.orders.insertMany(objects).save()

    const test = tests[key]
    const result = await benchmark((done: Function) => test(db).then(done))
    console.log(key.padEnd(maxKeyLength), result.toString('milliseconds'))
    await deleteDatabase(db)
  }
}

main()

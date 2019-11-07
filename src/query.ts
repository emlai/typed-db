import assert from 'assert'
import { matches } from 'lodash'
import { Property, QueryBuilder } from './types'
import { loadDatabaseData, saveDatabase } from './storage'

export enum QueryKind {
  createCollection = 'createCollection',
  addProperty = 'addProperty',
  insert = 'insert',
  getAll = 'getAll',
  update = 'update'
}

export type Query =
  | {
    kind: QueryKind.createCollection
    name: string
  }
  | {
    kind: QueryKind.addProperty
    collection: string
    property: Property
  }
  | {
    kind: QueryKind.insert
    collection: string
    objects: readonly any[]
  }
  | {
    kind: QueryKind.getAll
    collection: string
    conditions?: object
  }
  | {
    kind: QueryKind.update
    collection: string
    updates: object
  }

export async function executeQuery(queryBuilder: QueryBuilder<any>): Promise<any> {
  assert(queryBuilder._queries.length > 0)
  const db = await loadDatabaseData(queryBuilder._path)
  let result: object[] | void

  for (const query of queryBuilder._queries) {
    switch (query.kind) {
      case QueryKind.createCollection:
        db.collections[query.name] = { properties: [], objects: [] }
        break
      case QueryKind.addProperty:
        db.collections[query.collection].properties.push(query.property)
        break
      case QueryKind.insert:
        db.collections[query.collection].objects.push(...query.objects)
        break
      case QueryKind.getAll:
        result = db.collections[query.collection].objects.filter(matches(query.conditions))
        break
      case QueryKind.update:
        db.collections[query.collection].objects.forEach(object => Object.assign(object, query.updates))
        break
    }
  }

  await saveDatabase(db, queryBuilder._path)
  return result
}

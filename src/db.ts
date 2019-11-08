import { Collection, CollectionsMap, Database, Property, QueryBuilder, Type } from './types'
import { executeQuery, Query, QueryKind } from './query'

export function createQueryBuilder<Collections>(db: Database<Collections>): QueryBuilder<Collections> {
  return {
    ...db,
    _queries: [],

    createCollection<Name extends string>(name: Name) {
      (this as any)[name] = createCollectionInterface(this, this, name, [])
      this._queries.push({ kind: QueryKind.createCollection, name })
      return this as any
    },

    save() {
      return executeQuery(this)
    }
  }
}

export function createDatabaseInterface<Collections>(
  name: string,
  dbPath: string,
  collections: CollectionsMap<Collections>
): Database<Collections> {
  return {
    ...collections,
    collections,
    name,
    _path: dbPath,

    createCollection<Name extends string>(name: Name) {
      return createQueryBuilder(this).createCollection(name)
    }
  }
}

export function createCollectionInterface<ObjectType, Collections, CollectionName extends keyof Collections>(
  qb: QueryBuilder<Collections> | null,
  db: Database<Collections>,
  collection: string,
  properties: Property[]
): Collection<ObjectType, Collections, CollectionName> {
  const pushQuery = (query: Query) => {
    const queryBuilder = qb || createQueryBuilder(db)
    queryBuilder._queries.push(query)
    return queryBuilder
  }

  return {
    properties,

    addProperty(name: string, type: Type) {
      return pushQuery({ kind: QueryKind.addProperty, collection, property: { name, type } }) as any
    },

    insert(object: ObjectType) {
      return pushQuery({ kind: QueryKind.insert, collection, objects: [object] })
    },

    insertMany(objects: readonly ObjectType[]) {
      return pushQuery({ kind: QueryKind.insert, collection, objects })
    },

    findAll(conditions?: Partial<ObjectType>) {
      return executeQuery(pushQuery({ kind: QueryKind.findAll, collection, conditions }))
    },

    update(updates: Partial<ObjectType>) {
      return pushQuery({ kind: QueryKind.update, collection, updates })
    }
  }
}

import fs from 'fs'
import { promisify } from 'util'
import { matches } from 'lodash'
import { Database, Collection, CollectionsMap, Type } from './types'

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const unlink = promisify(fs.unlink)

function createCollectionInterface(name: string): Collection<{}> {
  return {
    name,
    properties: [],
    objects: []
  }
}

function createDatabaseInterface<Collections>(
  name: string,
  collections: CollectionsMap<Collections>
): Database<Collections> {
  return {
    name,
    collections,

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    createCollection<Name extends string>(name: Name) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const collections = this.collections as any
      collections[name] = createCollectionInterface(name)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this as any
    },

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    addProperty(collection: keyof Collections, name: string, type: Type) {
      this.collections[collection].properties.push({ name, type })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this as any
    },

    insert<CollectionName extends keyof Collections>(
      collection: CollectionName,
      object: Collections[CollectionName]
    ): Database<Collections> {
      this.collections[collection].objects.push(object)
      return this
    },

    insertMultiple<CollectionName extends keyof Collections>(
      collection: CollectionName,
      objects: readonly (Collections[CollectionName])[]
    ): Database<Collections> {
      this.collections[collection].objects.push(...objects)
      return this
    },

    getAll<CollectionName extends keyof Collections>(
      collection: CollectionName,
      conditions?: Partial<Collections[CollectionName]>
    ): readonly (Collections[CollectionName])[] {
      return this.collections[collection].objects.filter(matches(conditions))
    },

    update<CollectionName extends keyof Collections>(
      collection: CollectionName,
      updates: Partial<Collections[CollectionName]>
    ): Database<Collections> {
      this.collections[collection].objects.forEach(object => Object.assign(object, updates))
      return this
    }
  }
}

export function createDatabase(name: string): Database<{}> {
  return createDatabaseInterface(name, {})
}

export async function saveDatabase(db: Database<{}>, path: string): Promise<void> {
  await writeFile(path, JSON.stringify(db.collections))
}

export async function loadDatabase<Collections>(path: string): Promise<Database<Collections>> {
  const buffer = await readFile(path)
  const collections = await JSON.parse(buffer.toString())
  return createDatabaseInterface(name, collections)
}

export async function deleteDatabase(path: string): Promise<void> {
  await unlink(path)
}

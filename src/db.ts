import fs from 'fs'
import { promisify } from 'util'
import { matches } from 'lodash'
import { Database, Collection, Type, CollectionData } from './types'

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const unlink = promisify(fs.unlink)

function createDatabaseInterface<Collections>(name: string): Database<{}> {
  return {
    name,

    createCollection<Name extends string>(name: Name) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const self = this as any
      self[name] = createCollectionInterface(this, { properties: [], objects: [] })
      return self
    }
  }
}

function createCollectionInterface<ObjectType, Collections, CollectionName extends keyof Collections>(
  db: Database,
  data: CollectionData<ObjectType>
): Collection<ObjectType, Collections, CollectionName> {
  return {
    ...data, // TODO(optimize): Assign to 'data' instead of creating a new object.

    addProperty(name: string, type: Type) {
      this.properties.push({ name, type })
      return db
    },

    insert(object: ObjectType) {
      this.objects.push(object)
      return db
    },

    insertMultiple(objects: readonly ObjectType[]) {
      this.objects.push(...objects)
      return db
    },

    getAll(conditions?: Partial<ObjectType>) {
      return this.objects.filter(matches(conditions))
    },

    update(updates: Partial<ObjectType>) {
      this.objects.forEach(object => Object.assign(object, updates))
      return db
    }
  }
}

export function createDatabase(name: string): Database<{}> {
  return createDatabaseInterface(name)
}

export async function saveDatabase(db: Database, path: string): Promise<void> {
  await writeFile(path, JSON.stringify(db))
}

export async function loadDatabase<Collections>(path: string): Promise<Database<Collections>> {
  const buffer = await readFile(path)
  const { name, ...collectionsData } = await JSON.parse(buffer.toString())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createDatabaseInterface(name) as any
  for (const key in collectionsData) {
    db[key] = createCollectionInterface(db, collectionsData[key])
  }
  return db
}

export async function deleteDatabase(path: string): Promise<void> {
  await unlink(path)
}

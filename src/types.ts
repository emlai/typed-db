type AddProperty<Collections, CollectionName extends keyof Collections, Name extends string, propertyType> = Database<
  Collections & { [k in CollectionName]: Collections[CollectionName] & { [k in Name]: propertyType } }
>

export type CollectionsMap<Collections> = { [k in keyof Collections]: Collection<Collections[k]> }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Database<Collections = any> {
  name: string
  collections: CollectionsMap<Collections>

  createCollection<Name extends string>(name: Name): Database<Collections & { [k in Name]: {} }>

  addProperty<CollectionName extends keyof Collections, Name extends string>(
    collection: CollectionName,
    name: Name,
    type: Type.number
  ): AddProperty<Collections, CollectionName, Name, number>

  addProperty<CollectionName extends keyof Collections, Name extends string>(
    collection: CollectionName,
    name: Name,
    type: Type.string
  ): AddProperty<Collections, CollectionName, Name, string>

  insert<CollectionName extends keyof Collections>(
    collection: CollectionName,
    object: Collections[CollectionName]
  ): Database<Collections>

  insertMultiple<CollectionName extends keyof Collections>(
    collection: CollectionName,
    objects: readonly (Collections[CollectionName])[]
  ): Database<Collections>

  getAll<CollectionName extends keyof Collections>(collection: CollectionName): readonly (Collections[CollectionName])[]

  getAll<CollectionName extends keyof Collections>(
    collection: CollectionName,
    conditions: Partial<Collections[CollectionName]>
  ): readonly (Collections[CollectionName])[]

  update<CollectionName extends keyof Collections>(
    collection: CollectionName,
    updates: Partial<Collections[CollectionName]>
  ): Database<Collections>
}

export interface Collection<ObjectType> {
  name: string
  properties: Property[]
  objects: ObjectType[]
}

interface Property {
  name: string
  type: Type
}

export enum Type {
  number = 'number',
  string = 'string'
}

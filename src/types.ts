type AddProperty<Collections, CollectionName extends keyof Collections, Name extends string, PropertyType> = Database<
  Collections & { [k in CollectionName]: Collections[CollectionName] & { [k in Name]: PropertyType } }
>

export type CollectionsMap<Collections> = { [k in keyof Collections]: Collection<Collections[k], Collections, k> }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database<Collections = any> = CollectionsMap<Collections> & {
  name: string

  createCollection<Name extends string>(name: Name): Database<Collections & { [k in Name]: {} }>
}

export interface CollectionData<ObjectType> {
  readonly properties: Property[]
  objects: ObjectType[] // TODO: Make this private.
}

export interface Collection<ObjectType, Collections, CollectionName extends keyof Collections>
  extends CollectionData<ObjectType> {
  addProperty<Name extends string>(
    name: Name,
    type: Type.number
  ): AddProperty<Collections, CollectionName, Name, number>

  addProperty<Name extends string>(
    name: Name,
    type: Type.string
  ): AddProperty<Collections, CollectionName, Name, string>

  insert(object: ObjectType): Database<Collections>

  insertMultiple(objects: readonly ObjectType[]): Database<Collections>

  getAll(): ObjectType[]

  getAll(conditions: Partial<ObjectType>): ObjectType[]

  update(updates: Partial<ObjectType>): Database<Collections>
}

export interface Property {
  name: string
  type: Type
}

export enum Type {
  number = 'number',
  string = 'string'
}

import { Query } from './query'

type AddProperty<Collections, CollectionName extends keyof Collections, Name extends string, PropertyType> =
  QueryBuilder<Collections & { [k in CollectionName]: Collections[CollectionName] & { [k in Name]: PropertyType } }>

export type CollectionsMap<Collections> = { [k in keyof Collections]: Collection<Collections[k], Collections, k> }

export type Database<Collections = any> = CollectionsMap<Collections> & {
  collections: CollectionsMap<Collections>
  name: string
  _path: string

  createCollection<Name extends string>(name: Name): QueryBuilder<Collections & { [k in Name]: {} }>
}

export type QueryBuilder<Collections> = Database<Collections> & {
  _queries: Query[]

  save(): Promise<void>
}

export interface Collection<ObjectType, Collections, CollectionName extends keyof Collections> {
  readonly properties: Property[]

  addProperty<Name extends string>(
    name: Name,
    type: Type.number
  ): AddProperty<Collections, CollectionName, Name, number>

  addProperty<Name extends string>(
    name: Name,
    type: Type.string
  ): AddProperty<Collections, CollectionName, Name, string>

  insert(object: ObjectType): QueryBuilder<Collections>

  insertMany(objects: readonly ObjectType[]): QueryBuilder<Collections>

  findAll(conditions?: Partial<ObjectType>): Promise<ObjectType[]>

  update(updates: Partial<ObjectType>): QueryBuilder<Collections>
}

export interface Property {
  name: string
  type: Type
}

export enum Type {
  number = 'number',
  string = 'string'
}
